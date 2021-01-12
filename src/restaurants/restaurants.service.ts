import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) // Entity만 넣어준다.
    private readonly resaturants: Repository<Restaurant>, //restaurants는 Restaurant Entity의 Repository
  ) {}

  async getAll(): Promise<Restaurant[]> {
    return this.resaturants.find();
  }

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      const newRestaurant = this.resaturants.create(createRestaurantDto);
      await this.resaturants.save(newRestaurant);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateRestaurant({ id, data }: UpdateRestaurantDto): Promise<boolean> {
    try {
      this.resaturants.update(id, { ...data });
      return true;
    } catch (error) {
      return false;
    }
  }

  /*
  typeORM function 비교

  create
  js,ts 측면에서 class를 생성하는 것 밖에 안 된다. db에는 접근 x

  save
  Entity가 없으면 삽입하고 저장한다. 있으면 Update

  update
  Entity가 있던 없던 update 해주고 없어도 Error X
  */
}
