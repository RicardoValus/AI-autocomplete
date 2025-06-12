declare module '@xenova/transformers' {
  export class Pipeline {
    static allowLocalModels: boolean;
    static allowRemoteModels: boolean;
  }

  export function pipeline(
    task: string,
    model: string,
    options?: {
      quantized?: boolean;
      progress_callback?: (progress: number) => void;
    }
  ): Promise<any>;
} 