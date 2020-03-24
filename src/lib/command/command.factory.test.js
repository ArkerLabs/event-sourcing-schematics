"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
describe('Controller Factory', () => {
    const runner = new testing_1.SchematicTestRunner('.', path.join(process.cwd(), 'src/collection.json'));
    it('should manage name only', () => {
        const options = {
            name: 'foo',
            skipImport: true,
            spec: false,
            flat: false,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/foo/foo.controller.ts')).toBeDefined();
        expect(files.find(filename => filename === '/foo/foo.controller.spec.ts')).not.toBeDefined();
        expect(tree.readContent('/foo/foo.controller.ts')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo')\n" +
            'export class FooController {}\n');
    });
    it('should manage name has a path', () => {
        const options = {
            name: 'bar/foo',
            skipImport: true,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/bar/foo/foo.controller.ts')).toBeDefined();
        expect(files.find(filename => filename === '/bar/foo/foo.controller.spec.ts')).toBeDefined();
        expect(tree.readContent('/bar/foo/foo.controller.ts')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo')\n" +
            'export class FooController {}\n');
    });
    it('should manage name and path', () => {
        const options = {
            name: 'foo',
            path: 'bar',
            skipImport: true,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/bar/foo/foo.controller.ts')).toBeDefined();
        expect(files.find(filename => filename === '/bar/foo/foo.controller.spec.ts')).toBeDefined();
        expect(tree.readContent('/bar/foo/foo.controller.ts')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo')\n" +
            'export class FooController {}\n');
    });
    it('should manage name to dasherize', () => {
        const options = {
            name: 'fooBar',
            skipImport: true,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/foo-bar/foo-bar.controller.ts')).toBeDefined();
        expect(files.find(filename => filename === '/foo-bar/foo-bar.controller.spec.ts')).toBeDefined();
        expect(tree.readContent('/foo-bar/foo-bar.controller.ts')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo-bar')\n" +
            'export class FooBarController {}\n');
    });
    it('should manage path to dasherize', () => {
        const options = {
            name: 'barBaz/foo',
            skipImport: true,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/bar-baz/foo/foo.controller.ts')).toBeDefined();
        expect(files.find(filename => filename === '/bar-baz/foo/foo.controller.spec.ts')).toBeDefined();
        expect(tree.readContent('/bar-baz/foo/foo.controller.ts')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo')\n" +
            'export class FooController {}\n');
    });
    it('should manage javascript file', () => {
        const options = {
            name: 'foo',
            language: 'js',
            skipImport: true,
        };
        const tree = runner.runSchematic('controller', options);
        const files = tree.files;
        expect(files.find(filename => filename === '/foo/foo.controller.js')).toBeDefined();
        expect(files.find(filename => filename === '/foo/foo.controller.spec.js')).toBeDefined();
        expect(tree.readContent('/foo/foo.controller.js')).toEqual("import { Controller } from '@nestjs/common';\n" +
            '\n' +
            "@Controller('foo')\n" +
            'export class FooController {}\n');
    });
    it('should manage declaration in app module', () => {
        const app = {
            name: '',
        };
        let tree = runner.runSchematic('application', app);
        const options = {
            name: 'foo',
        };
        tree = runner.runSchematic('controller', options, tree);
        expect(tree.readContent(core_1.normalize('/src/app.module.ts'))).toEqual("import { Module } from '@nestjs/common';\n" +
            "import { AppController } from './app.controller';\n" +
            "import { AppService } from './app.service';\n" +
            "import { FooController } from './foo/foo.controller';\n" +
            '\n' +
            '@Module({\n' +
            '  imports: [],\n' +
            '  controllers: [AppController, FooController],\n' +
            '  providers: [AppService],\n' +
            '})\n' +
            'export class AppModule {}\n');
    });
    it('should manage declaration in foo module', () => {
        const app = {
            name: '',
        };
        let tree = runner.runSchematic('application', app);
        const module = {
            name: 'foo',
        };
        tree = runner.runSchematic('module', module, tree);
        const options = {
            name: 'foo',
        };
        tree = runner.runSchematic('controller', options, tree);
        expect(tree.readContent(core_1.normalize('/src/foo/foo.module.ts'))).toEqual("import { Module } from '@nestjs/common';\n" +
            "import { FooController } from './foo.controller';\n" +
            '\n' +
            '@Module({\n' +
            '  controllers: [FooController]\n' +
            '})\n' +
            'export class FooModule {}\n');
    });
});
//# sourceMappingURL=command.factory.test.js.map