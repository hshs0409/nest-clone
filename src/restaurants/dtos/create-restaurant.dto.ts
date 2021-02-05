import { Field, InputType, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

// InputType 네가 input하고자 하는 data의 type => 그저 하나의 Obj

// ArgsType => 분리된 arg로써 정의할 수 있게 해준다. => 분리된 값들을 전달해준다.
@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, ['name', 'coverImg', 'address']) {
  @Field(type => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}

// dto에 class validator 사용 가능
/*@PickType, @OmitType @IntersectionType @PartialType 모두 InputType으로 만들어준다. */
