import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { useCallback, useMemo } from 'react';

export function useAWSUploadService() {
  // const info = store.getState().elfInfo.elfInfo;
  const info = {
    identityPoolID: 'ap-northeast-1:8bf42009-6180-4bcf-97fd-9a849a9f1927',
    bucket: 'forest-dev',
  };
  const REGION = 'ap-northeast-1';

  const s3Client = useMemo(
    () =>
      new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({
            region: REGION,
          }),
          identityPoolId: info.identityPoolID || '',
        }),
      }),
    [info.identityPoolID],
  );

  const awsUploadFile = useCallback(
    async (file: File) => {
      const FileKey = `${Date.now()}-${file.name}`;
      const params = {
        Bucket: info.bucket,
        Key: FileKey,
      };
      try {
        const res = await s3Client.send(
          new PutObjectCommand({
            ACL: 'public-read',
            Body: file,
            ContentType: file.type,
            ContentLength: file.size,
            ...params,
          }),
        );
        console.log('=====uploadFile success:', res);
        return `https://${info.bucket}.s3.${REGION}.amazonaws.com/${encodeURIComponent(FileKey)}`;
      } catch (error) {
        console.error('=====awsUploadFile error:', error);
        return Promise.reject(error);
      }
    },
    [s3Client, info.bucket],
  );

  return {
    awsUploadFile,
  };
}
