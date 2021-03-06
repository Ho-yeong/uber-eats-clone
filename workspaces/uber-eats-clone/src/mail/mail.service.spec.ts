import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { MailService } from "./mail.service"

jest.mock('got', () => {});
jest.mock('form-data', () => {
    return {
        append: jest.fn()
    }
})

describe('MailService', () => {
    let service: MailService;

    beforeEach( async() => {
        const module = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: {
                        apiKey : "testApiKey",
                        domain: "testDomain",
                        fromEmail: "testEmail"
                    }
                }
            ]
        }).compile();
        service = module.get<MailService>(MailService)
    })


    it('should be definded', () => {
        expect(service).toBeDefined()
    })
})