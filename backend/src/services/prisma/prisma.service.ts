import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

// adds type safe client with extension methods
function createPrismaClientWithExtension() {
  const client = () => new PrismaClient()

  return class {
    constructor() {
      return client()
    }
  } as new () => ReturnType<typeof client>
}

@Injectable()
export class PrismaService extends createPrismaClientWithExtension() implements OnModuleInit {
  public async onModuleInit() {
    await this.$connect()
  }
}
