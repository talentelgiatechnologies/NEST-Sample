import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from 'uuid';

export function multerOptions(path: string) {

    return {
        limits: {
            fileSize: 10 * 1024 * 1024
        },
        fileFilter: (req: any, file: any, cb: any) => {

            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|avif|webp)$/)) {
                cb(null, true);
            } else {
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = process.env[path];
                cb(null, uploadPath)
            },
            filename: (req: any, file: any, cb: any) => {
                cb(null, `${uuid()}${extname(file.originalname)}`);
            }
        })
    }
}

export function multerPdfOptions(path: string) {

    return {
        limits: {
            fileSize: 10 * 1024 * 1024
        },
        fileFilter: (req: any, file: any, cb: any) => {

            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|avif|webp|pdf)$/)) {
                cb(null, true);
            } else {
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = process.env[path];
                cb(null, uploadPath)
            },
            filename: (req: any, file: any, cb: any) => {
                cb(null, `${uuid()}${extname(file.originalname)}`);
            }
        })
    }
}

export function multerVideoOptions(path: string) {

    return {
        limits: {
            fileSize: 200 * 1024 * 1024
        },
        fileFilter: (req: any, file: any, cb: any) => {

            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|avif|webp|webm|mp4|mov)$/)) {
                cb(null, true);
            } else {
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = process.env[path];
                cb(null, uploadPath)
            },
            filename: (req: any, file: any, cb: any) => {
                cb(null, `${uuid()}${extname(file.originalname)}`);
            }
        })
    }
}