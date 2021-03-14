import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from 'aws-sdk'


const BUCKET_NAME = 'uberEatsCloneHoYeong'

@Controller("uploads")
export class UploadsController {

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {

        AWS.config.update({
            credentials: {
                accessKeyId: "test",
                secretAccessKey: "1234"
            }
        })
        try {
            const objectName =  `${Date.now() + file.originalname}`;
            await new AWS.S3().putObject({
                Bucket: BUCKET_NAME,
                Body: file.buffer,
                Key: objectName,
                ACL: 'public-read'
            }).promise()
            
            const fileURL = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`
            return { url: fileURL}
        } catch (err) {
            console.log(err)
            return null
        }
    }
}