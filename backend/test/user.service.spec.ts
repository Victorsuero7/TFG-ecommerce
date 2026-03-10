import { UserServiceImpl } from '../src/services/UserServiceImpl';
import { UserRepository } from '../src/repositories/UserRepository';
import { User } from '../src/Models/user.entity';
import { UserDTO } from '../src/dtos/UserDTO';
import { LoginUserDTO } from '../src/dtos/LoginUserDTO';
import { RegisterUserDTO } from '../src/dtos/RegisterUserDTO';
import { HttpErrors } from '../src/utils/HttpErrors';
import { JWTAdapter } from '../src/utils/Jwt';
import * as bcrypt from 'bcrypt';
import { } from 'jest';

// Mockeamos las dependencias externas
jest.mock('bcrypt');
jest.mock('../src/utils/Jwt');

describe('UserServiceImpl', () => {

    let service: UserServiceImpl;
    let mockRepo: jest.Mocked<UserRepository>;

    // Datos de prueba
    let mockUser: User;
    let mockUserDTO: UserDTO;

    beforeEach(() => {
        // Mock del repositorio
        mockRepo = {
            findAllByPage: jest.fn(),
            findOneById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            getDisabled: jest.fn(),
        } as any;

        service = new UserServiceImpl(mockRepo);

        // Preparamos entidad base para usar en los tests
        mockUser = new User();
        mockUser.id = 1;
        mockUser.email = 'test@example.com';
        mockUser.password = 'hashedPassword123';
        mockUser.name = 'John';
        mockUser.role = 'USER';
        mockUser.enable = true;

        // Mockeamos fromEntity para aislar el mapper
        jest.spyOn(UserDTO, 'fromEntity').mockImplementation((entity: any) => {
            return {
                id: entity.id,
                email: entity.email,
                toEntity: jest.fn().mockReturnValue(entity)
            } as unknown as UserDTO;
        });

        mockUserDTO = UserDTO.fromEntity(mockUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPaginated', () => {
        it('should return paginated users when they exist', async () => {
            mockRepo.findAllByPage.mockResolvedValue([[mockUser], 1]);

            // PPP por defecto es 20 en tu código
            const response = await service.getAllPaginated(1);

            expect(mockRepo.findAllByPage).toHaveBeenCalledWith(0, 20);
            expect(response.result.length).toBe(1);
            expect(response.result[0].id).toBe(1);
        });

        it('should throw NotFound when no users are found', async () => {
            mockRepo.findAllByPage.mockResolvedValue([[], 0]);

            await expect(service.getAllPaginated(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('getOne', () => {
        it('should return user when it exists', async () => {
            mockRepo.findOneById.mockResolvedValue(mockUser);

            const response = await service.getOne(1);

            expect(mockRepo.findOneById).toHaveBeenCalledWith(1);
            expect(response.result?.id).toBe(1);
        });

        it('should throw NotFound when user does not exist', async () => {
            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.getOne(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('insert', () => {
        it('should insert and return new user', async () => {
            mockRepo.findByEmail.mockResolvedValue(null); // Email no existe
            mockRepo.save.mockResolvedValue(mockUser);

            const response = await service.insert(mockUserDTO);

            expect(mockUserDTO.toEntity).toHaveBeenCalled();
            expect(mockRepo.save).toHaveBeenCalled();
            expect(response.result.id).toBe(1);
        });

        it('should throw BadRequest when email already exists', async () => {
            mockRepo.findByEmail.mockResolvedValue(mockUser); // Email ya existe

            await expect(service.insert(mockUserDTO))
                .rejects
                .toThrow(HttpErrors.badRequest("User alredy exists"));
        });
    });

    describe('login', () => {
        const loginDto = { email: 'test@example.com', password: 'password123' } as LoginUserDTO;

        it('should return token when credentials are valid', async () => {
            mockRepo.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (JWTAdapter.generateToken as jest.Mock).mockResolvedValue('valid-jwt-token');

            const result = await service.login(loginDto);

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
            expect(JWTAdapter.generateToken).toHaveBeenCalled();
            expect(result).toBe('valid-jwt-token');
        });

        it('should throw InternalServerError when user is not found (due to catch block)', async () => {
            mockRepo.findByEmail.mockResolvedValue(null);

            await expect(service.login(loginDto))
                .rejects
                .toThrow(HttpErrors.internalServerError("Something went wrong"));
        });

        it('should throw InternalServerError when password is invalid (due to catch block)', async () => {
            mockRepo.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginDto))
                .rejects
                .toThrow(HttpErrors.internalServerError("Something went wrong"));
        });
    });

    describe('signUp', () => {
        const registerDto = { 
            email: 'new@example.com', 
            name: 'Jane', 
            lastName: 'Doe', 
            phoneNumber: '123456789', 
            password: 'password123' 
        } as RegisterUserDTO;

        it('should register and return new user when email is available', async () => {
            mockRepo.findByEmail.mockResolvedValue(null);
            (bcrypt.genSaltSync as jest.Mock).mockReturnValue('randomSalt');
            (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPass');
            
            mockRepo.save.mockImplementation(async (userToSave) => {
                userToSave.id = 2; // Simulamos que la BD le asigna el ID 2
                return userToSave;
            });

            const response = await service.signUp(registerDto);

            expect(bcrypt.genSaltSync).toHaveBeenCalledWith(5);
            expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 'randomSalt');
            expect(mockRepo.save).toHaveBeenCalled();
            expect(response.result.email).toBe('new@example.com');
        });

        it('should throw InternalServerError when email already exists (due to catch block)', async () => {
            mockRepo.findByEmail.mockResolvedValue(mockUser);

            await expect(service.signUp(registerDto))
                .rejects
                .toThrow(HttpErrors.internalServerError("Something went wrong"));
        });
    });

    describe('emailExists', () => {
        it('should return success response when email does not exist', async () => {
            mockRepo.findByEmail.mockResolvedValue(null);

            const response = await service.emailExists('free@example.com');

            expect(response.result).toBe('Email available');
        });

        it('should throw BadRequest when email already exists', async () => {
            mockRepo.findByEmail.mockResolvedValue(mockUser);

            await expect(service.emailExists('test@example.com'))
                .rejects
                .toThrow(HttpErrors.badRequest("User alredy exist"));
        });
    });

    describe('listDisabled', () => {
        it('should return disabled users and count', async () => {
            mockRepo.getDisabled.mockResolvedValue([[mockUser], 1]);

            const response = await service.listDisabled(1);

            expect(mockRepo.getDisabled).toHaveBeenCalledWith(0, 20);
            expect(response.result.length).toBe(1);
        });

        it('should throw NotFound when there are no disabled users', async () => {
            mockRepo.getDisabled.mockResolvedValue([[], 0]);

            await expect(service.listDisabled(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });
    });

    describe('delete', () => {
        it('should disable and return the user when it exists', async () => {
            mockRepo.findOneById.mockResolvedValue(mockUser);
            mockRepo.save.mockResolvedValue(mockUser); // Simula guardado exitoso

            const response = await service.delete(1);

            expect(mockUser.enable).toBe(false); // Comprobamos que cambió la propiedad a false
            expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
            expect(response.result.id).toBe(1);
        });

        it('should throw NotFound when user does not exist', async () => {
            mockRepo.findOneById.mockResolvedValue(null);

            await expect(service.delete(1))
                .rejects
                .toThrow(HttpErrors.NotFound());
        });

        it('should throw InternalServerError if save fails returning null', async () => {
            mockRepo.findOneById.mockResolvedValue(mockUser);
            mockRepo.save.mockResolvedValue(null as any);

            await expect(service.delete(1))
                .rejects
                .toThrow(HttpErrors.internalServerError());
        });
    });
});