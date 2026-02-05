import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminUserModule } from './AdminUser/adminuser.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ListMetaModule } from './list-meta/list-meta.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PropertyModule } from './property/property.module';
import { PaymentModule } from './payment/payment.module';
import { CurrencyModule } from './currency/currency.module';
import { InboxModule } from './inbox/inbox.module';
import { ReviewModule } from './review/review.module';
import { CmsModule } from './cms/cms.module';
import { StaticModule } from './static/static.module';
import { PayoutModule } from './payout/payout.module';
import { SiteModule } from './site/site.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ChatModule } from './chat/chat.module';
import { MailerModule } from './mailer/mailer.module';
import { ReportModule } from './report/report.module';
import { CouponCodeModule } from './coupon-code/coupon-code.module';
import { CityModule } from './city/city.module';
import { HostModule } from './host/host.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.development'],
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      serveRoot: '/api/web/assets'
    }),
    AdminUserModule,
    AuthModule,
    UserModule,
    ListMetaModule,
    PropertyModule,
    PaymentModule,
    CurrencyModule,
    InboxModule,
    ReviewModule,
    CmsModule,
    StaticModule,
    PayoutModule,
    SiteModule,
    WishlistModule,
    ChatModule,
    MailerModule,
    ReportModule,
    CouponCodeModule,
    CityModule,
    HostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    
  }
}
