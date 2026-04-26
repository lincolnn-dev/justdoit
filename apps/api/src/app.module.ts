import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthModule } from "./modules/health/health.module.js";
import { TasksModule } from "./modules/tasks/tasks.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env"],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>("MONGODB_URI"),
        dbName: configService.get<string>("MONGODB_DB") ?? "justdoit",
      }),
    }),
    HealthModule,
    TasksModule,
  ],
})
export class AppModule {}

