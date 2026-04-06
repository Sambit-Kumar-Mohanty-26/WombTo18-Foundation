"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            const frontendUrl = process.env.FRONTEND_URL;
            const allowed = [
                frontendUrl,
                frontendUrl?.replace(/\/$/, ''),
                frontendUrl && !frontendUrl.endsWith('/') ? `${frontendUrl}/` : null,
                'https://womb-to18-foundation.vercel.app',
                'https://womb-to-18-foundation.vercel.app',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175',
                'http://localhost:5176',
            ].filter(Boolean);
            if (!origin || allowed.some(domain => domain === origin)) {
                callback(null, true);
            }
            else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(null, true);
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'), {
        prefix: '/public',
        setHeaders: (res) => {
            res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
            res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        },
    });
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Team Orion API')
        .setDescription('Backend API for Team Orion NGO platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 5000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map