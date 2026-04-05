import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * StorageService — Unified file storage abstraction.
 * 
 * Uses Supabase Storage in production (when SUPABASE_URL + SUPABASE_SERVICE_KEY are set).
 * Falls back to local disk storage in development.
 * 
 * Environment Variables:
 *   SUPABASE_URL          — Your Supabase project URL
 *   SUPABASE_SERVICE_KEY  — Service role key (server-side only, NOT anon key)
 *   SUPABASE_BUCKET       — Bucket name (default: "uploads")
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient | null = null;
  private readonly bucket: string;
  private readonly isSupabase: boolean;

  constructor(private readonly config: ConfigService) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL');
    const supabaseKey = this.config.get<string>('SUPABASE_SERVICE_KEY');
    this.bucket = this.config.get<string>('SUPABASE_BUCKET') || 'uploads';

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.isSupabase = true;
      this.logger.log('✅ Supabase Storage initialized');
    } else {
      this.isSupabase = false;
      this.logger.warn('⚠️ Supabase not configured — using local disk storage (dev mode)');
    }
  }

  /**
   * Upload a file and return its public URL.
   * @param fileBuffer - The file content as a Buffer
   * @param remotePath - The path within the bucket (e.g., "advisory/photo-123.jpg")
   * @param contentType - MIME type (e.g., "image/jpeg")
   * @returns The public URL of the uploaded file
   */
  async upload(fileBuffer: Buffer, remotePath: string, contentType: string): Promise<string> {
    if (this.isSupabase && this.supabase) {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .upload(remotePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        this.logger.error(`Supabase upload error: ${error.message}`);
        throw new Error(`File upload failed: ${error.message}`);
      }

      const { data: urlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(remotePath);

      this.logger.log(`Uploaded to Supabase: ${remotePath}`);
      return urlData.publicUrl;
    }

    // Fallback: local disk
    const localDir = path.join(process.cwd(), 'uploads', path.dirname(remotePath));
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localPath = path.join(process.cwd(), 'uploads', remotePath);
    fs.writeFileSync(localPath, fileBuffer);
    this.logger.log(`Saved locally: ${localPath}`);
    return `/uploads/${remotePath}`;
  }

  /**
   * Upload a file from a local file path (e.g., a generated PDF).
   * @param localFilePath - Absolute path to the file on disk
   * @param remotePath - The path within the bucket
   * @param contentType - MIME type
   * @returns The public URL
   */
  async uploadFromPath(localFilePath: string, remotePath: string, contentType: string): Promise<string> {
    if (this.isSupabase && this.supabase) {
      const fileBuffer = fs.readFileSync(localFilePath);
      const url = await this.upload(fileBuffer, remotePath, contentType);
      // Clean up local temp file after uploading to Supabase
      try { fs.unlinkSync(localFilePath); } catch {}
      return url;
    }

    // In local mode, the file is already on disk — just return its path
    const relativePath = localFilePath.replace(process.cwd(), '').replace(/\\/g, '/');
    return relativePath;
  }

  /**
   * Delete a file from storage.
   */
  async delete(remotePath: string): Promise<void> {
    if (this.isSupabase && this.supabase) {
      await this.supabase.storage.from(this.bucket).remove([remotePath]);
      return;
    }

    const localPath = path.join(process.cwd(), 'uploads', remotePath);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }

  /**
   * Check if running in Supabase mode.
   */
  get isCloud(): boolean {
    return this.isSupabase;
  }
}
