import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dot";
import { Restaurant } from "../entities/retaurant.entity";


@ObjectType()
export class MyRestaurantsOutPut extends CoreOutput {
    @Field(type => [Restaurant], { nullable: true})
    restaurants?: Restaurant[]
}

