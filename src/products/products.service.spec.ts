import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  // Mock del repository - simulamos todas sus funciones
  const mockProductsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Datos de prueba
  const mockProduct = {
    id: '1',
    name: 'Producto Test',
    price: 100,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createProductDto: CreateProductDto = {
    name: 'Producto Test',
    price: 100,
    stock: 10,
  };

  const updateProductDto: UpdateProductDto = {
    name: 'Producto Actualizado',
    price: 150,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);

    // Limpiamos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', () => {
      // Configuramos el mock para que devuelva un producto con un nombre diferente
      const newProduct = { ...mockProduct, name: 'Producto Nuevo' };
      mockProductsRepository.create.mockReturnValue(newProduct);

      const result = service.create(createProductDto);

      expect(mockProductsRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(newProduct);
    });

    it('should throw BadRequestException when repository returns null', () => {
      // Configuramos el mock para que devuelva null
      mockProductsRepository.create.mockReturnValue(null);

      expect(() => service.create(createProductDto)).toThrow(BadRequestException);
      expect(() => service.create(createProductDto)).toThrow('El nombre, el precio y el stock son obligatorios');
    });

    it('should throw ConflictException when product with same name exists', () => {
      // Configuramos el mock para que devuelva un producto con el mismo nombre
      const existingProduct = { ...mockProduct, name: createProductDto.name };
      mockProductsRepository.create.mockReturnValue(existingProduct);

      expect(() => service.create(createProductDto)).toThrow(ConflictException);
      expect(() => service.create(createProductDto)).toThrow('Ya existe un producto con ese nombre');
    });
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      const mockProducts = [mockProduct, { ...mockProduct, id: '2', name: 'Producto 2' }];
      mockProductsRepository.findAll.mockReturnValue(mockProducts);

      const result = service.findAll();

      expect(mockProductsRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', () => {
      mockProductsRepository.findAll.mockReturnValue([]);

      const result = service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product when found', () => {
      mockProductsRepository.findOne.mockReturnValue(mockProduct);

      const result = service.findOne('1');

      expect(mockProductsRepository.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException when product not found', () => {
      mockProductsRepository.findOne.mockReturnValue(null);

      expect(() => service.findOne('999')).toThrow(BadRequestException);
      expect(() => service.findOne('999')).toThrow('Product not found');
    });
  });

  describe('update', () => {
    it('should update a product successfully', () => {
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsRepository.findOne.mockReturnValue(mockProduct);
      mockProductsRepository.update.mockReturnValue(updatedProduct);

      const result = service.update('1', updateProductDto);

      expect(mockProductsRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockProductsRepository.update).toHaveBeenCalledWith('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw BadRequestException when product to update not found', () => {
      mockProductsRepository.findOne.mockReturnValue(null);

      expect(() => service.update('999', updateProductDto)).toThrow(BadRequestException);
      expect(() => service.update('999', updateProductDto)).toThrow('Product not found');
      expect(mockProductsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', () => {
      mockProductsRepository.findOne.mockReturnValue(mockProduct);
      mockProductsRepository.remove.mockReturnValue(mockProduct);

      const result = service.remove('1');

      expect(mockProductsRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockProductsRepository.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException when product to remove not found', () => {
      mockProductsRepository.findOne.mockReturnValue(null);

      expect(() => service.remove('999')).toThrow(BadRequestException);
      expect(() => service.remove('999')).toThrow('Product not found');
      expect(mockProductsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
