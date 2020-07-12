import { House } from "./house_pb";
import {
  BoolValue,
  Int32Value,
  StringValue,
} from "google-protobuf/google/protobuf/wrappers_pb";

export class Mapper {
  public house(house: House.AsObject): House {
    const houseGrpc: House = new House();
    houseGrpc.setId(castToNumberValue(house.id));
    houseGrpc.setStreetname(castToStringValue(house.streetname));
    houseGrpc.setHousenumber(castToStringValue(house.housenumber));
    houseGrpc.setNumberofbedrooms(castToNumberValue(house.numberofbedrooms));
    houseGrpc.setSquarefeet(castToNumberValue(house.squarefeet));
    houseGrpc.setOnsale(castToBoolValue(house.onsale));
    houseGrpc.setIsrental(castToBoolValue(house.isrental));
    return houseGrpc;
  }

  public houses(houses: House.AsObject[]): House[] {
    return houses.map((h) => this.house(h));
  }
}

function castToBoolValue(
  boolIn: BoolValue.AsObject | undefined
): BoolValue | undefined {
  if (boolIn !== undefined) {
    const boolOut = new BoolValue();
    boolOut.setValue(boolIn.value);
    return boolOut;
  }
  return undefined;
}
function castToNumberValue(
  inVal: Int32Value.AsObject | undefined
): Int32Value | undefined {
  if (inVal !== undefined) {
    const outVal = new Int32Value();
    outVal.setValue(inVal.value);
    return outVal;
  }
  return undefined;
}
function castToStringValue(
  inVal: StringValue.AsObject | undefined
): StringValue | undefined {
  if (inVal !== undefined) {
    const outVal = new StringValue();
    outVal.setValue(inVal.value);
    return outVal;
  }
  return undefined;
}
export const mapping = new Mapper();
