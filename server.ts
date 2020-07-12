import grpc from "grpc";
import { IHouseServiceServer, HouseServiceService } from "./house_grpc_pb";
import {
  HousesBySizeResponse,
  HousesBySizeRequest,
  House,
  HouseRequest,
  HouseResponse,
  HousesRequest,
  HousesResponse,
} from "./house_pb";
import { mapper } from "./mapper";
const allHouse: House.AsObject[] = [
  {
    id: 1,
    housenumber: "123",
    squarefeet: 1200,
    streetname: "Funny Street",
    numberbedrooms: 2,
    onsale: true,
    isrental: {
      value: true,
    },
  },
  {
    id: 2,
    housenumber: "500",
    squarefeet: 2000,
    streetname: "Zoo",
    numberbedrooms: 2,
    onsale: true,
    isrental: {
      value: false,
    },
  },
  {
    id: 3,
    housenumber: "67",
    squarefeet: 890,
    streetname: "Spring Cir",
    numberbedrooms: 3,
    onsale: false,
  },
];
class HouseService implements IHouseServiceServer {
  public getHousesBySize(
    call: grpc.ServerUnaryCall<HousesBySizeRequest>,
    callback: grpc.sendUnaryData<HousesBySizeResponse>
  ): void {
    const request = call.request;
    const min = request.getMinsquarefeet();
    const ids = allHouse.filter((d) => d.squarefeet >= min).map((f) => f.id);
    const response = new HousesBySizeResponse();
    response.setIdsList(ids);
    callback(null, response);
  }

  public getHouse(
    call: grpc.ServerUnaryCall<HouseRequest>,
    callback: grpc.sendUnaryData<HouseResponse>
  ): void {
    const request = call.request;
    const house = allHouse.filter((d) => d.id === request.getId()).shift();
    const response = new HouseResponse();
    let houseGrpc: House = new House();
    if (house !== undefined) {
      houseGrpc = mapper.house(house);
    }
    response.setHouse(houseGrpc);
    callback(null, response);
  }

  public getHouses(
    call: grpc.ServerUnaryCall<HousesRequest>,
    callback: grpc.sendUnaryData<HousesResponse>
  ): void {
    const request = call.request;
    const houses = request.getIdList();
    const response = new HousesResponse();
    const housesObj = houses
      .map((d) => allHouse.find((ff) => ff.id === d))
      .filter((d) => d !== undefined) as House.AsObject[];
    response.setHousesList(mapper.houses(housesObj));
    callback(null, response);
  }
}

const server = new grpc.Server();
server.addService<IHouseServiceServer>(HouseServiceService, new HouseService());
server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
server.start();
