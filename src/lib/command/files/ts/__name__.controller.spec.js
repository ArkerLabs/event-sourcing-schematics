"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
classify(name) %  > Controller;
from;
'./<%= name %>.controller';
describe('<%= classify(name) %> Controller', () => {
    let controller;
     %  > Controller;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            controllers: [, classify(name) %  > Controller],
        }).compile();
        controller = module.get << ;
        classify(name) %  > Controller > ;
        classify(name) %  > Controller;
    }));
});
it('should be defined', () => {
    expect(controller).toBeDefined();
});
;
//# sourceMappingURL=__name__.controller.spec.js.map