import { GoogleGenAI } from "@google/genai";

export interface VideoGenerationConfig {
  prompt: string;
  resolution?: '720p' | '1080p';
  aspectRatio?: '16:9' | '9:16';
}

export class VideoShowcaseService {
  private static instance: VideoShowcaseService;
  
  private constructor() {}

  public static getInstance(): VideoShowcaseService {
    if (!VideoShowcaseService.instance) {
      VideoShowcaseService.instance = new VideoShowcaseService();
    }
    return VideoShowcaseService.instance;
  }

  private async getAI() {
    const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please select one from the settings menu or the bottom of the modal.");
    }
    return new GoogleGenAI({ apiKey });
  }

  public async generateProductShowcase(productName: string, description: string, aspectRatio: '16:9' | '9:16' = '16:9') {
    const ai = await this.getAI();
    const prompt = `Create a luxury cinematic product showcase video for a product called "${productName}". 
    Context: ${description}. 
    The video should feature smooth camera pans, high-end lighting, and an elegant, aspirational mood. 
    Show the product in a minimalist, high-end environment like a modern gallery or a luxury residence.`;

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      return operation;
    } catch (error) {
      console.error("Error generating video:", error);
      throw error;
    }
  }

  public async generateGalleryWalkthrough(galleryName: string) {
    const ai = await this.getAI();
    const prompt = `A cinematic first-person virtual walkthrough of the "${galleryName}". 
    The environment is a futuristic, floating digital gallery with white minimalist architecture, 
    soft blue ambient lighting, and luxury decor pieces floating on pedestals. 
    The camera moves gracefully through the space, showcasing the immersive atmosphere and architectural details.`;

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      return operation;
    } catch (error) {
      console.error("Error generating gallery walkthrough:", error);
      throw error;
    }
  }

  public async pollOperation(ai: GoogleGenAI, operation: any) {
    return await ai.operations.getVideosOperation({ operation });
  }

  public async fetchVideoBlob(uri: string) {
     const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
     const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey || '',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch video data");
      return await response.blob();
  }
}

export const videoService = VideoShowcaseService.getInstance();
