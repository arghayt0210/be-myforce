import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { ErrorHandler } from '@/helpers/error';
import pathToFfmpeg from 'ffmpeg-static';
import fs from 'fs';

console.log('pathToFfmpeg:-----', pathToFfmpeg);
ffmpeg.setFfmpegPath(pathToFfmpeg!);

export const compressVideo = (inputBuffer: Buffer): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const tempInput = `temp_input_${Date.now()}.mp4`;
      const tempOutput = `temp_output_${Date.now()}.mp4`;
  
      // Write input buffer to temporary file
      fs.writeFileSync(tempInput, inputBuffer);
  
      ffmpeg()
      .input(tempInput)
      .outputOptions([
        '-crf 30', // Increased from 28 to 30
      ])
      .output(tempOutput)
        .on('start', (commandLine) => {
          console.log('FFmpeg started:', commandLine);
        })
        .on('error', (err, _stdout, _stderr) => {
          console.error('FFmpeg error:', err);
          // Cleanup temp files
          fs.unlinkSync(tempInput);
          if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
          reject(new ErrorHandler(400, `Video compression failed: ${err.message}`));
        })
        .on('end', () => {
          // Read the output file
          const outputBuffer = fs.readFileSync(tempOutput);
          
          // Cleanup temp files
          fs.unlinkSync(tempInput);
          fs.unlinkSync(tempOutput);
          
          console.log('Compression complete. Final size:', outputBuffer.length);
          resolve(outputBuffer);
        })
        .run();
    });
  };
  
  export const processVideo = async (file: Express.Multer.File) => {
    try {
      if (!file.buffer) {
        throw new ErrorHandler(400, 'No video buffer provided');
      }
  
      // Validate mime type
      if (!file.mimetype.startsWith('video/')) {
        throw new ErrorHandler(400, 'Invalid file type. Only video files are allowed.');
      }
  
      console.log('Starting video processing. Input size:', file.size);
      console.log('File mimetype:', file.mimetype);
      
      // Create a new stream for duration check
      const durationStream = Readable.from(Buffer.from(file.buffer));
      const duration = await getVideoDurationInSeconds(durationStream);
      
      if (duration <= 0) {
        throw new ErrorHandler(400, 'Invalid video duration');
      }
      
      // Compress video
      const processedBuffer = await compressVideo(file.buffer);
      
      console.log('Video processing complete. Duration:', duration);
      
      return {
        buffer: processedBuffer,
        duration: Math.round(duration)
      };
    } catch (error) {
      console.error('Video processing error:', error);
      throw new ErrorHandler(400, `Video processing failed: ${error.message}`);
    }
  };
