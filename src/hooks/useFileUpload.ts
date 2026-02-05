import { useState, useCallback } from 'react';
import type { TextureFile, ModelFile, SoundFile } from '@/types/addon';
import { generateUUID } from '@/lib/utils';

export interface FileUploadState {
  textures: TextureFile[];
  models: ModelFile[];
  sounds: SoundFile[];
}

export function useFileUpload() {
  const [files, setFiles] = useState<FileUploadState>({
    textures: [],
    models: [],
    sounds: []
  });

  const [isUploading, setIsUploading] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadTextures = useCallback(async (
    fileList: FileList | null,
    type: 'entity' | 'block' | 'item'
  ): Promise<TextureFile[]> => {
    if (!fileList || fileList.length === 0) return [];

    setIsUploading(true);
    const uploadedTextures: TextureFile[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        if (!file.type.startsWith('image/')) {
          console.warn(`跳过非图片文件: ${file.name}`);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        
        // 获取图片尺寸
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });

        const texture: TextureFile = {
          id: generateUUID(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl,
          type,
          width: img.width,
          height: img.height
        };

        uploadedTextures.push(texture);
      }

      setFiles(prev => ({
        ...prev,
        textures: [...prev.textures, ...uploadedTextures]
      }));

      return uploadedTextures;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadModels = useCallback(async (
    fileList: FileList | null,
    type: 'entity' | 'block' | 'item'
  ): Promise<ModelFile[]> => {
    if (!fileList || fileList.length === 0) return [];

    setIsUploading(true);
    const uploadedModels: ModelFile[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        const validExtensions = ['.json', '.geo.json', '.obj', '.gltf', '.glb'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validExtensions.some(e => ext.includes(e.replace('.', '')))) {
          console.warn(`跳过不支持的模型格式: ${file.name}`);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        
        let format: ModelFile['format'] = 'json';
        if (ext === '.obj') format = 'obj';
        if (ext === '.gltf' || ext === '.glb') format = 'gltf';

        const model: ModelFile = {
          id: generateUUID(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl,
          type,
          format
        };

        uploadedModels.push(model);
      }

      setFiles(prev => ({
        ...prev,
        models: [...prev.models, ...uploadedModels]
      }));

      return uploadedModels;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadSounds = useCallback(async (
    fileList: FileList | null,
    category: SoundFile['category']
  ): Promise<SoundFile[]> => {
    if (!fileList || fileList.length === 0) return [];

    setIsUploading(true);
    const uploadedSounds: SoundFile[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        if (!file.type.startsWith('audio/')) {
          console.warn(`跳过非音频文件: ${file.name}`);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);

        const sound: SoundFile = {
          id: generateUUID(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl,
          category
        };

        uploadedSounds.push(sound);
      }

      setFiles(prev => ({
        ...prev,
        sounds: [...prev.sounds, ...uploadedSounds]
      }));

      return uploadedSounds;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeTexture = useCallback((id: string) => {
    setFiles(prev => ({
      ...prev,
      textures: prev.textures.filter(t => t.id !== id)
    }));
  }, []);

  const removeModel = useCallback((id: string) => {
    setFiles(prev => ({
      ...prev,
      models: prev.models.filter(m => m.id !== id)
    }));
  }, []);

  const removeSound = useCallback((id: string) => {
    setFiles(prev => ({
      ...prev,
      sounds: prev.sounds.filter(s => s.id !== id)
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFiles({
      textures: [],
      models: [],
      sounds: []
    });
  }, []);

  return {
    files,
    isUploading,
    uploadTextures,
    uploadModels,
    uploadSounds,
    removeTexture,
    removeModel,
    removeSound,
    clearAll
  };
}
