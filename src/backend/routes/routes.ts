import { Routes } from "nest-router";
import { AppModule } from "../app.module";
import { AuthModule } from "../api/auth/auth.module";
import { UserModule } from "../api/user/user.module";

export const routes: Routes = [
    {
      path: '/api/v1',
      module: AppModule,
      children: [
        {
          path: '/auth',
          module: AuthModule,
        },
        {
          path: '/users',
          module: UserModule,
        },
      ],
    },
  ];