# 🚀 NestJS Products API

API REST desarrollada con NestJS, PostgreSQL y Prisma para gestión de productos.

## 📋 Características

- ✅ **CRUD completo** para productos
- ✅ **Validaciones** con DTOs y class-validator
- ✅ **Manejo de excepciones** personalizado
- ✅ **Pruebas unitarias** con Jest
- ✅ **Base de datos PostgreSQL** con Prisma ORM
- ✅ **Dockerización** lista para producción

## 🛠️ Tecnologías
- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL 15
- **ORM**: Prisma 6
- **Validación**: class-validator
- **Testing**: Jest
- **Containerización**: Docker

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🗄️ Base de Datos

### Configuración inicial
```bash
# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

### Modelo de datos
```prisma
model Product {
  id        String   @id @default(uuid())
  name      String   @unique
  price     Decimal
  stock     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas específicas
npm test -- products.service.spec.ts

# Modo watch
npm run test:watch

# Cobertura de código
npm run test:cov
```

## 📡 API Endpoints

### Productos
- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear nuevo producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto


### Ejemplo de uso:
```bash
# Crear producto
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "stock": 10}'

# Listar productos
curl http://localhost:3000/products
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t nestjs-api .

# Ejecutar contenedor
docker run -p 3000:3000 nestjs-api
```