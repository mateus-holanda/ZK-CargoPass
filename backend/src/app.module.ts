import { Logger, MiddlewareConsumer, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { join } from "path"
import { AuthControllerModule } from "./controllers/auth/auth-controller.module"
import { UserControllerModule } from "./controllers/user/user-controller.module"
import { AuthMiddleware } from "./middlewares/auth.middleware"
import { GrantMiddleware } from "./middlewares/grant.middleware"
import { JsonBodyMiddleware } from "./middlewares/json-body.middleware"
import { configLoader } from "./utils/config-loader"
import { DocumentControllerModule } from "./controllers/document/document-controller.module"

const CONFIG_FILE = join(__dirname, '../config/config.yml')

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configLoader(CONFIG_FILE)], isGlobal: true }),
    AuthControllerModule,
    UserControllerModule,
    DocumentControllerModule,
  ],
  controllers: [],
  providers: [ConfigService, Logger],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    // This middleware parses the request body to a json for all other routes.
    consumer
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
    consumer.apply(AuthMiddleware, GrantMiddleware).forRoutes('*')
  }
}
