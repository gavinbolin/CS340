import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { S3DAOProvider } from "../providers/FactoryProvider";

const BUCKET = "gbolin-tweeter";
const REGION = "us-west-1";

export class S3DAO implements S3DAOProvider{
  async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params = {
      Bucket: BUCKET,
      Key: `image/${fileName}`,
      Body: decodedImageBuffer,
      ContentType: "image/jpg",
      ACL: ObjectCannedACL.public_read, 
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      console.log("HERE IMAGE URL:: ", REGION);
      return (`https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`);
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
