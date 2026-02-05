// ==================== 基础类型 ====================

export interface AddonProject {
  id: string;
  name: string;
  description: string;
  version: string;
  minEngineVersion: [number, number, number];
  author: string;
  uuid: string;
  moduleUuid: string;
  dependencyUuid: string;
  entities: CustomEntity[];
  blocks: CustomBlock[];
  items: CustomItem[];
  recipes: CustomRecipe[];
  biomes: CustomBiome[];
  textures: TextureFile[];
  models: ModelFile[];
  sounds: SoundFile[];
}

// ==================== 实体类型 ====================

export interface CustomEntity {
  id: string;
  name: string;
  identifier: string;
  behavior: EntityBehavior;
  resource: EntityResource;
}

export interface EntityBehavior {
  health: number;
  movementSpeed: number;
  attackDamage: number;
  followRange: number;
  knockbackResistance: number;
  canFly: boolean;
  isBoss: boolean;
  spawnNaturally: boolean;
  spawnBiomes: string[];
  spawnWeight: number;
  minSpawnCount: number;
  maxSpawnCount: number;
  drops: EntityDrop[];
  behaviors: string[];
}

export interface EntityResource {
  texture: string;
  model: string;
  scale: number;
  hasBossBar: boolean;
  bossBarColor: string;
  spawnEggColor1: string;
  spawnEggColor2: string;
}

export interface EntityDrop {
  item: string;
  count: number;
  chance: number;
}

// ==================== 方块类型 ====================

export interface CustomBlock {
  id: string;
  name: string;
  identifier: string;
  behavior: BlockBehavior;
  resource: BlockResource;
}

export interface BlockBehavior {
  hardness: number;
  resistance: number;
  friction: number;
  lightLevel: number;
  harvestLevel: number;
  requiresTool: boolean;
  isOpaque: boolean;
  mapColor: string;
  soundType: string;
  canBeWaterlogged: boolean;
  hasCollision: boolean;
}

export interface BlockResource {
  texture: string;
  renderMethod: 'alpha_test' | 'blend' | 'opaque';
  faceDimming: boolean;
  ambientOcclusion: boolean;
}

// ==================== 物品类型 ====================

export interface CustomItem {
  id: string;
  name: string;
  identifier: string;
  behavior: ItemBehavior;
  resource: ItemResource;
}

export interface ItemBehavior {
  maxStackSize: number;
  durability: number;
  isFood: boolean;
  nutrition: number;
  saturation: number;
  isTool: boolean;
  harvestLevel: number;
  attackDamage: number;
  attackSpeed: number;
  canDestroyInCreative: boolean;
}

export interface ItemResource {
  texture: string;
  handheld: boolean;
  glint: boolean;
}

// ==================== 配方类型 ====================

export interface CustomRecipe {
  id: string;
  name: string;
  type: 'shaped' | 'shapeless' | 'smelting' | 'blasting' | 'smoking' | 'campfire';
  pattern?: string[];
  key?: Record<string, string>;
  ingredients?: string[];
  result: RecipeResult;
  cookingTime?: number;
  experience?: number;
}

export interface RecipeResult {
  item: string;
  count: number;
  data?: number;
}

// ==================== 生物群系类型 ====================

export interface CustomBiome {
  id: string;
  name: string;
  identifier: string;
  climate: BiomeClimate;
  sky: BiomeSky;
  spawning: BiomeSpawning;
  features: BiomeFeatures;
  weight: number;
}

export interface BiomeClimate {
  temperature: number;
  downfall: number;
  precipitation: 'none' | 'rain' | 'snow';
  snowAccumulation: [number, number];
}

export interface BiomeSky {
  skyColor: string;
  waterColor: string;
  waterFogColor: string;
  fogColor: string;
  foliageColor: string;
  grassColor: string;
}

export interface BiomeSpawning {
  spawnEntities: BiomeSpawnEntity[];
}

export interface BiomeSpawnEntity {
  entityId: string;
  weight: number;
  minCount: number;
  maxCount: number;
}

export interface BiomeFeatures {
  terrain: string[];
  vegetation: string[];
  structures: string[];
  ores: string[];
}

// ==================== 资源文件类型 ====================

export interface TextureFile {
  id: string;
  name: string;
  dataUrl: string;
  type: 'entity' | 'block' | 'item';
  width: number;
  height: number;
}

export interface ModelFile {
  id: string;
  name: string;
  dataUrl: string;
  type: 'entity' | 'block' | 'item';
  format: 'json' | 'obj' | 'gltf';
}

export interface SoundFile {
  id: string;
  name: string;
  dataUrl: string;
  category: 'ambient' | 'block' | 'hostile' | 'music' | 'neutral' | 'player' | 'record' | 'weather';
}

// ==================== 生成选项 ====================

export interface GenerateOptions {
  includeBehaviorPack: boolean;
  includeResourcePack: boolean;
  includeDocumentation: boolean;
  includeExampleWorld: boolean;
  minifyJson: boolean;
}

// ==================== 默认配置 ====================

export const DEFAULT_PROJECT: Omit<AddonProject, 'id' | 'uuid' | 'moduleUuid' | 'dependencyUuid'> = {
  name: '我的Addon',
  description: '这是一个自定义Minecraft Addon',
  version: '1.0.0',
  minEngineVersion: [1, 20, 0],
  author: '',
  entities: [],
  blocks: [],
  items: [],
  recipes: [],
  biomes: [],
  textures: [],
  models: [],
  sounds: [],
};

export const DEFAULT_ENTITY_BEHAVIOR: EntityBehavior = {
  health: 20,
  movementSpeed: 0.25,
  attackDamage: 3,
  followRange: 16,
  knockbackResistance: 0,
  canFly: false,
  isBoss: false,
  spawnNaturally: false,
  spawnBiomes: [],
  spawnWeight: 10,
  minSpawnCount: 1,
  maxSpawnCount: 4,
  drops: [],
  behaviors: ['wander', 'look_at_player'],
};

export const DEFAULT_BLOCK_BEHAVIOR: BlockBehavior = {
  hardness: 1,
  resistance: 1,
  friction: 0.6,
  lightLevel: 0,
  harvestLevel: 0,
  requiresTool: false,
  isOpaque: true,
  mapColor: '#8F7748',
  soundType: 'stone',
  canBeWaterlogged: false,
  hasCollision: true,
};

export const DEFAULT_ITEM_BEHAVIOR: ItemBehavior = {
  maxStackSize: 64,
  durability: 0,
  isFood: false,
  nutrition: 0,
  saturation: 0,
  isTool: false,
  harvestLevel: 0,
  attackDamage: 0,
  attackSpeed: 0,
  canDestroyInCreative: true,
};

export const DEFAULT_BIOME_CLIMATE: BiomeClimate = {
  temperature: 0.8,
  downfall: 0.4,
  precipitation: 'rain',
  snowAccumulation: [0, 0.125],
};

export const DEFAULT_BIOME_SKY: BiomeSky = {
  skyColor: '#78A7FF',
  waterColor: '#3F76E4',
  waterFogColor: '#050533',
  fogColor: '#C0D8FF',
  foliageColor: '#71A74D',
  grassColor: '#91BD59',
};
