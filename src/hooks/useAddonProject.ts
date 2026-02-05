import { useState, useCallback, useEffect } from 'react';
import type { 
  AddonProject, 
  CustomEntity, 
  CustomBlock, 
  CustomItem, 
  CustomRecipe,
  CustomBiome,
  TextureFile,
  ModelFile,
  SoundFile
} from '@/types/addon';
import { generateUUID, DEFAULT_PROJECT } from '@/types/addon';

const STORAGE_KEY = 'mc-addon-project-v2';

export function useAddonProject() {
  const [project, setProject] = useState<AddonProject>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          biomes: parsed.biomes || [],
          textures: parsed.textures || [],
          models: parsed.models || [],
          sounds: parsed.sounds || [],
        };
      } catch {
        return createNewProject();
      }
    }
    return createNewProject();
  });

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedBiomeId, setSelectedBiomeId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const updateProject = useCallback((updates: Partial<AddonProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  // ========== 实体操作 ==========
  const addEntity = useCallback((entity: CustomEntity) => {
    setProject(prev => ({
      ...prev,
      entities: [...prev.entities, entity]
    }));
    setSelectedEntityId(entity.id);
  }, []);

  const updateEntity = useCallback((id: string, updates: Partial<CustomEntity>) => {
    setProject(prev => ({
      ...prev,
      entities: prev.entities.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  }, []);

  const deleteEntity = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      entities: prev.entities.filter(e => e.id !== id)
    }));
    if (selectedEntityId === id) setSelectedEntityId(null);
  }, [selectedEntityId]);

  // ========== 方块操作 ==========
  const addBlock = useCallback((block: CustomBlock) => {
    setProject(prev => ({
      ...prev,
      blocks: [...prev.blocks, block]
    }));
    setSelectedBlockId(block.id);
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<CustomBlock>) => {
    setProject(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }, [selectedBlockId]);

  // ========== 物品操作 ==========
  const addItem = useCallback((item: CustomItem) => {
    setProject(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    setSelectedItemId(item.id);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CustomItem>) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, ...updates } : i)
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }));
    if (selectedItemId === id) setSelectedItemId(null);
  }, [selectedItemId]);

  // ========== 配方操作 ==========
  const addRecipe = useCallback((recipe: CustomRecipe) => {
    setProject(prev => ({
      ...prev,
      recipes: [...prev.recipes, recipe]
    }));
    setSelectedRecipeId(recipe.id);
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<CustomRecipe>) => {
    setProject(prev => ({
      ...prev,
      recipes: prev.recipes.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      recipes: prev.recipes.filter(r => r.id !== id)
    }));
    if (selectedRecipeId === id) setSelectedRecipeId(null);
  }, [selectedRecipeId]);

  // ========== 生物群系操作 ==========
  const addBiome = useCallback((biome: CustomBiome) => {
    setProject(prev => ({
      ...prev,
      biomes: [...prev.biomes, biome]
    }));
    setSelectedBiomeId(biome.id);
  }, []);

  const updateBiome = useCallback((id: string, updates: Partial<CustomBiome>) => {
    setProject(prev => ({
      ...prev,
      biomes: prev.biomes.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  }, []);

  const deleteBiome = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      biomes: prev.biomes.filter(b => b.id !== id)
    }));
    if (selectedBiomeId === id) setSelectedBiomeId(null);
  }, [selectedBiomeId]);

  // ========== 资源文件操作 ==========
  const addTexture = useCallback((texture: TextureFile) => {
    setProject(prev => ({
      ...prev,
      textures: [...prev.textures, texture]
    }));
  }, []);

  const removeTexture = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      textures: prev.textures.filter(t => t.id !== id)
    }));
  }, []);

  const addModel = useCallback((model: ModelFile) => {
    setProject(prev => ({
      ...prev,
      models: [...prev.models, model]
    }));
  }, []);

  const removeModel = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      models: prev.models.filter(m => m.id !== id)
    }));
  }, []);

  const addSound = useCallback((sound: SoundFile) => {
    setProject(prev => ({
      ...prev,
      sounds: [...prev.sounds, sound]
    }));
  }, []);

  const removeSound = useCallback((id: string) => {
    setProject(prev => ({
      ...prev,
      sounds: prev.sounds.filter(s => s.id !== id)
    }));
  }, []);

  const resetProject = useCallback(() => {
    setProject(createNewProject());
    setSelectedEntityId(null);
    setSelectedBlockId(null);
    setSelectedItemId(null);
    setSelectedRecipeId(null);
    setSelectedBiomeId(null);
  }, []);

  return {
    project,
    selectedEntityId,
    selectedBlockId,
    selectedItemId,
    selectedRecipeId,
    selectedBiomeId,
    setSelectedEntityId,
    setSelectedBlockId,
    setSelectedItemId,
    setSelectedRecipeId,
    setSelectedBiomeId,
    updateProject,
    addEntity,
    updateEntity,
    deleteEntity,
    addBlock,
    updateBlock,
    deleteBlock,
    addItem,
    updateItem,
    deleteItem,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addBiome,
    updateBiome,
    deleteBiome,
    addTexture,
    removeTexture,
    addModel,
    removeModel,
    addSound,
    removeSound,
    resetProject,
  };
}

function createNewProject(): AddonProject {
  return {
    id: generateUUID(),
    ...DEFAULT_PROJECT,
    uuid: generateUUID(),
    moduleUuid: generateUUID(),
    dependencyUuid: generateUUID(),
  } as AddonProject;
}
