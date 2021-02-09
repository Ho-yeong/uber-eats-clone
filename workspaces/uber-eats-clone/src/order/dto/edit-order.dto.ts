import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dot";
import { Order } from "../entities/order.entity";

@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) {}


@ObjectType()
export class EditOrderOutput extends CoreOutput {}