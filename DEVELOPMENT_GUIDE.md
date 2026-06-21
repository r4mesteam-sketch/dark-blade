# Dark Blade — Complete Development Guide

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Feature Implementation Guide](#feature-implementation-guide)
5. [API Development](#api-development)
6. [Frontend Development](#frontend-development)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Using Docker (Recommended)
```bash
# 1. Clone/navigate to project
cd dark-blade

# 2. Create .env file
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Run migrations
docker-compose exec backend npx prisma migrate dev

# 5. Access services
# Frontend: http://localhost:3000
# API: http://localhost:3001
# Docs: http://localhost:3001/api/docs
```

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Database (optional, if using local DB)
# Ensure PostgreSQL is running on localhost:5432
```

---

## Project Structure

```
dark-blade/
├── backend/
│   ├── src/
│   │   ├── auth/              ← Authentication & JWT
│   │   ├── users/             ← User management
│   │   ├── sellers/           ← Seller operations
│   │   ├── buyers/            ← Buyer operations
│   │   ├── stores/            ← Store management
│   │   ├── products/          ← Product catalog
│   │   ├── orders/            ← Order processing
│   │   ├── payments/          ← Bitcoin payments
│   │   ├── subscriptions/     ← Seller subscriptions
│   │   ├── chat/              ← Messaging system
│   │   ├── notifications/     ← Notification center
│   │   ├── admin/             ← Admin operations
│   │   ├── common/            ← Shared utilities
│   │   └── main.ts            ← Entry point
│   ├── prisma/
│   │   ├── schema.prisma      ← Database schema
│   │   └── migrations/        ← DB migrations
│   ├── test/                  ← Test files
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/            ← Auth pages (login, register)
│   │   ├── marketplace/       ← Product browsing
│   │   ├── dashboard/         ← Seller dashboard
│   │   ├── buyer/             ← Buyer dashboard
│   │   ├── admin/             ← Admin dashboard
│   │   ├── layout.tsx         ← Root layout
│   │   ├── page.tsx           ← Home page
│   │   └── globals.css        ← Global styles
│   ├── components/            ← Reusable components
│   ├── lib/                   ← Utilities & helpers
│   ├── styles/                ← Styling
│   ├── public/                ← Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── init.sql
│
├── docker-compose.yml
├── .env.example
├── README.md
├── SETUP_GUIDE.md
├── API_REFERENCE.md
├── PROJECT_STATUS.md
└── DEVELOPMENT_GUIDE.md (this file)
```

---

## Development Workflow

### 1. Creating a New Backend Feature

**Example: Adding a Category Management Module**

```bash
# 1. Create module directory
mkdir -p src/categories

# 2. Generate NestJS files
nest g resource categories

# 3. Update Prisma schema (if needed)
# Edit: prisma/schema.prisma
npx prisma migrate dev --name add_categories

# 4. Implement service
# Edit: src/categories/categories.service.ts
# - Add methods for CRUD operations
# - Implement business logic

# 5. Implement controller
# Edit: src/categories/categories.controller.ts
# - Add endpoints with proper decorators
# - Add authorization guards

# 6. Add to app.module.ts
# Import CategoryModule

# 7. Test endpoints
curl -X GET http://localhost:3001/api/v1/categories
```

### 2. Creating a New Frontend Page

**Example: Adding a Product Detail Page**

```bash
# 1. Create route directory
mkdir -p app/products/[id]

# 2. Create page component
touch app/products/[id]/page.tsx

# 3. Create components (if needed)
mkdir -p components/Product
touch components/Product/ProductCard.tsx
touch components/Product/Reviews.tsx

# 4. Implement page logic
# - Fetch product data via API
# - Display product details
# - Handle add to cart/wishlist

# 5. Test in dev server
# Navigate to http://localhost:3000/products/product-id
```

### 3. Adding a Database Table

```bash
# 1. Update schema.prisma
# Add new model with relationships

# 2. Create migration
npx prisma migrate dev --name add_new_table

# 3. Verify in Prisma Studio
npx prisma studio

# 4. Update ORM in services
# Use new models in queries
```

---

## Feature Implementation Guide

### Implementing a Complete Feature (Step-by-step)

#### Feature: "Wishlist Management"

**Backend Implementation:**

1. **Database** ✅ Already in schema (Wishlist model)

2. **Service** (`src/buyers/buyers.service.ts`)
```typescript
async addToWishlist(buyerId: string, productId: string) {
  return this.prisma.wishlist.create({
    data: { buyerId, productId },
  });
}

async removeFromWishlist(buyerId: string, productId: string) {
  return this.prisma.wishlist.delete({
    where: { buyerId_productId: { buyerId, productId } },
  });
}
```

3. **Controller** (`src/buyers/buyers.controller.ts`)
```typescript
@Post('wishlists/:productId')
@UseGuards(JwtAuthGuard)
async addToWishlist(
  @GetUser() user: any,
  @Param('productId') productId: string,
) {
  const buyer = await this.buyersService.findByUserId(user.id);
  return this.buyersService.addToWishlist(buyer.id, productId);
}
```

4. **Tests** (`src/buyers/buyers.service.spec.ts`)
```typescript
describe('addToWishlist', () => {
  it('should add product to wishlist', async () => {
    const result = await service.addToWishlist('buyer-1', 'prod-1');
    expect(result.buyerId).toBe('buyer-1');
    expect(result.productId).toBe('prod-1');
  });
});
```

**Frontend Implementation:**

1. **API Hook** (`lib/api/useWishlist.ts`)
```typescript
export function useWishlist() {
  const addToWishlist = async (productId: string) => {
    return api.post(`/buyers/wishlists/${productId}`);
  };
  
  const removeFromWishlist = async (productId: string) => {
    return api.delete(`/buyers/wishlists/${productId}`);
  };
  
  return { addToWishlist, removeFromWishlist };
}
```

2. **Component** (`components/Product/WishlistButton.tsx`)
```typescript
export function WishlistButton({ productId }) {
  const { addToWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleToggle = async () => {
    await addToWishlist(productId);
    setIsWishlisted(!isWishlisted);
    toast.success('Added to wishlist');
  };
  
  return (
    <button onClick={handleToggle}>
      <FiHeart fill={isWishlisted ? 'red' : 'none'} />
    </button>
  );
}
```

3. **Integration** (Add to product page)
```typescript
<WishlistButton productId={productId} />
```

---

## API Development

### Adding a New Endpoint

**Pattern**: `POST /api/v1/{resource}/{action}`

```typescript
// 1. Add DTO
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}

// 2. Add Service method
async createProduct(storeId: string, dto: CreateProductDto) {
  return this.prisma.product.create({
    data: {
      storeId,
      ...dto,
      isDraft: true,
    },
  });
}

// 3. Add Controller endpoint
@Post()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
async createProduct(
  @GetUser() user: any,
  @Body() dto: CreateProductDto,
) {
  return this.productsService.createProduct(user.storeId, dto);
}

// 4. Test with cURL
curl -X POST http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Product","price":99.99}'
```

### Error Handling

```typescript
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Bad request
throw new BadRequestException('Invalid input data');

// Not found
throw new NotFoundException('Product not found');

// Unauthorized
throw new UnauthorizedException('Access denied');

// Conflict
throw new ConflictException('Email already exists');
```

---

## Frontend Development

### Creating a Reusable Component

```typescript
// components/Product/ProductCard.tsx
'use client';

interface ProductCardProps {
  product: any;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  return (
    <div className="bg-dark-card border border-gray-800 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="h-40 bg-dark-bg/50">
        <img src={product.images?.[0]?.url} alt={product.title} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white truncate">{product.title}</h3>
        <p className="text-sm text-gray-400">${product.price}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAddToCart}
            className="flex-1 py-2 bg-accent text-dark-bg rounded text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={onAddToWishlist}
            className="px-4 py-2 border border-accent rounded"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Data Fetching with SWR

```typescript
'use client';

import useSWR from 'swr';
import api from '@/lib/axios';

export default function ProductList() {
  const { data: products, isLoading, error } = useSWR(
    '/products',
    (url) => api.get(url).then(r => r.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid gap-4">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Testing

### Backend Unit Tests

```typescript
// src/products/products.service.spec.ts
describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a product', async () => {
    const mockProduct = { id: '1', title: 'Test', price: 99 };
    jest.spyOn(prisma.product, 'create').mockResolvedValue(mockProduct);

    const result = await service.create('store-1', {
      title: 'Test',
      price: 99,
    });

    expect(result.title).toBe('Test');
  });
});
```

### Running Tests

```bash
# Backend
npm run test              # Unit tests
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report
npm run test:e2e         # E2E tests

# Frontend
npm run test              # Jest tests
npm run test:watch       # Watch mode
npm run test:e2e         # Cypress E2E
```

---

## Deployment

### Production Deployment Checklist

- [ ] Set strong JWT secrets in `.env`
- [ ] Configure production database
- [ ] Enable HTTPS/SSL
- [ ] Set up email service (SMTP)
- [ ] Configure backup system
- [ ] Set environment variables
- [ ] Run database migrations
- [ ] Create admin account
- [ ] Test all user workflows
- [ ] Set up monitoring
- [ ] Configure CI/CD

### Deploy with Docker

```bash
# 1. Build images
docker build -f docker/Dockerfile.backend -t darkblade-backend .
docker build -f docker/Dockerfile.frontend -t darkblade-frontend .

# 2. Push to registry
docker tag darkblade-backend myregistry/darkblade-backend:1.0.0
docker push myregistry/darkblade-backend:1.0.0

# 3. Deploy with docker-compose or Kubernetes
docker-compose -f docker-compose.yml up -d
```

---

## Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Find and kill process on port 3000/3001
lsof -i :3000
kill -9 <PID>
```

**2. Database connection error**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL
```

**3. Prisma migration error**
```bash
# Reset database (development only)
npx prisma migrate reset

# Or manually:
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate dev --name fix
```

**4. npm dependencies conflict**
```bash
rm -rf node_modules package-lock.json
npm install
```

**5. Environment variables not loaded**
```bash
# Ensure .env is in project root
ls -la .env

# Check if using right path in config
console.log(process.env.DATABASE_URL)
```

---

## Commands Reference

### Backend
```bash
npm run build              # Build for production
npm run start              # Start production server
npm run start:dev          # Start with hot reload
npm run lint               # Run ESLint
npm run format             # Format code
npm run test               # Run tests
npx prisma migrate dev     # Create & run migration
npx prisma studio         # Open Prisma GUI
npx prisma generate       # Generate Prisma client
```

### Frontend
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript check
npm run format             # Format code
```

### Docker
```bash
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # Follow logs
docker-compose exec backend npm run db:seed  # Seed database
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Dark Blade Development Guide**
*Last Updated: January 2024*
*Version: 1.0.0*
