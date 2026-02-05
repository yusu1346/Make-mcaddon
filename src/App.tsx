import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAddonProject } from '@/hooks/useAddonProject';
import { useFileUpload } from '@/hooks/useFileUpload';
import { generateUUID, sanitizeIdentifier } from '@/lib/utils';
import { 
  Package, 
  Box, 
  Sword, 
  FlaskConical, 
  Map, 
  Image, 
  Download, 
  Trash2, 
  Plus,
  Settings,
  Info,
  Check,
  FileArchive,
  Layers,
  Sparkles,
  Palette
} from 'lucide-react';
import JSZip from 'jszip';

// 页面组件
function ProjectPage({ project, updateProject }: { project: any, updateProject: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            项目设置
          </CardTitle>
          <CardDescription>配置你的Addon基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>项目名称</Label>
            <Input 
              value={project.name} 
              onChange={e => updateProject({ name: e.target.value })}
              placeholder="我的Addon"
            />
          </div>
          <div className="grid gap-2">
            <Label>描述</Label>
            <Input 
              value={project.description} 
              onChange={e => updateProject({ description: e.target.value })}
              placeholder="这是一个自定义Minecraft Addon"
            />
          </div>
          <div className="grid gap-2">
            <Label>版本</Label>
            <Input 
              value={project.version} 
              onChange={e => updateProject({ version: e.target.value })}
              placeholder="1.0.0"
            />
          </div>
          <div className="grid gap-2">
            <Label>作者</Label>
            <Input 
              value={project.author} 
              onChange={e => updateProject({ author: e.target.value })}
              placeholder="你的名字"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EntitiesPage({ project, addEntity, updateEntity, deleteEntity }: any) {
  const [newEntityName, setNewEntityName] = useState('');

  const handleAddEntity = () => {
    if (!newEntityName.trim()) return;
    const id = generateUUID();
    addEntity({
      id,
      name: newEntityName,
      identifier: sanitizeIdentifier(newEntityName),
      behavior: {
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
      },
      resource: {
        texture: '',
        model: '',
        scale: 1,
        hasBossBar: false,
        bossBarColor: 'red',
        spawnEggColor1: '#FF0000',
        spawnEggColor2: '#00FF00',
      }
    });
    setNewEntityName('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            添加实体
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            value={newEntityName}
            onChange={e => setNewEntityName(e.target.value)}
            placeholder="输入实体名称"
            onKeyDown={e => e.key === 'Enter' && handleAddEntity()}
          />
          <Button onClick={handleAddEntity}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {project.entities.map((entity: any) => (
          <Card key={entity.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{entity.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => deleteEntity(entity.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <CardDescription>ID: {entity.identifier}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>生命值</Label>
                  <Input 
                    type="number"
                    value={entity.behavior.health}
                    onChange={e => updateEntity(entity.id, { 
                      behavior: { ...entity.behavior, health: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>移动速度</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={entity.behavior.movementSpeed}
                    onChange={e => updateEntity(entity.id, { 
                      behavior: { ...entity.behavior, movementSpeed: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={entity.behavior.isBoss}
                    onCheckedChange={checked => updateEntity(entity.id, { 
                      behavior: { ...entity.behavior, isBoss: checked }
                    })}
                  />
                  <Label>Boss实体</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={entity.behavior.canFly}
                    onCheckedChange={checked => updateEntity(entity.id, { 
                      behavior: { ...entity.behavior, canFly: checked }
                    })}
                  />
                  <Label>可以飞行</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BlocksPage({ project, addBlock, updateBlock, deleteBlock }: any) {
  const [newBlockName, setNewBlockName] = useState('');

  const handleAddBlock = () => {
    if (!newBlockName.trim()) return;
    const id = generateUUID();
    addBlock({
      id,
      name: newBlockName,
      identifier: sanitizeIdentifier(newBlockName),
      behavior: {
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
      },
      resource: {
        texture: '',
        renderMethod: 'opaque',
        faceDimming: true,
        ambientOcclusion: true,
      }
    });
    setNewBlockName('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            添加方块
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            value={newBlockName}
            onChange={e => setNewBlockName(e.target.value)}
            placeholder="输入方块名称"
            onKeyDown={e => e.key === 'Enter' && handleAddBlock()}
          />
          <Button onClick={handleAddBlock}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {project.blocks.map((block: any) => (
          <Card key={block.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{block.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => deleteBlock(block.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <CardDescription>ID: {block.identifier}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>硬度</Label>
                  <Input 
                    type="number"
                    value={block.behavior.hardness}
                    onChange={e => updateBlock(block.id, { 
                      behavior: { ...block.behavior, hardness: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>发光等级</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="15"
                    value={block.behavior.lightLevel}
                    onChange={e => updateBlock(block.id, { 
                      behavior: { ...block.behavior, lightLevel: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ItemsPage({ project, addItem, updateItem, deleteItem }: any) {
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const id = generateUUID();
    addItem({
      id,
      name: newItemName,
      identifier: sanitizeIdentifier(newItemName),
      behavior: {
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
      },
      resource: {
        texture: '',
        handheld: false,
        glint: false,
      }
    });
    setNewItemName('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="w-5 h-5" />
            添加物品
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            placeholder="输入物品名称"
            onKeyDown={e => e.key === 'Enter' && handleAddItem()}
          />
          <Button onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {project.items.map((item: any) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <CardDescription>ID: {item.identifier}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>最大堆叠</Label>
                  <Input 
                    type="number"
                    value={item.behavior.maxStackSize}
                    onChange={e => updateItem(item.id, { 
                      behavior: { ...item.behavior, maxStackSize: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>耐久度</Label>
                  <Input 
                    type="number"
                    value={item.behavior.durability}
                    onChange={e => updateItem(item.id, { 
                      behavior: { ...item.behavior, durability: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResourcesPage({ files, uploadTextures, removeTexture }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            纹理资源
          </CardTitle>
          <CardDescription>上传和管理你的纹理文件</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => uploadTextures(e.target.files, 'entity')}
              className="hidden"
              id="texture-upload"
            />
            <label htmlFor="texture-upload" className="cursor-pointer">
              <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">点击或拖拽上传纹理</p>
              <p className="text-xs text-muted-foreground mt-1">支持 PNG, JPG</p>
            </label>
          </div>

          {files.textures.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {files.textures.map((texture: any) => (
                <div key={texture.id} className="relative group">
                  <img 
                    src={texture.dataUrl} 
                    alt={texture.name}
                    className="w-full aspect-square object-contain bg-muted rounded"
                  />
                  <button
                    onClick={() => removeTexture(texture.id)}
                    className="absolute top-1 right-1 p-1 bg-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <p className="text-xs truncate mt-1">{texture.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BiomesPage({ project, addBiome, updateBiome, deleteBiome }: any) {
  const [newBiomeName, setNewBiomeName] = useState('');

  const handleAddBiome = () => {
    if (!newBiomeName.trim()) return;
    const id = generateUUID();
    addBiome({
      id,
      name: newBiomeName,
      identifier: sanitizeIdentifier(newBiomeName),
      climate: {
        temperature: 0.8,
        downfall: 0.4,
        precipitation: 'rain',
        snowAccumulation: [0, 0.125],
      },
      sky: {
        skyColor: '#78A7FF',
        waterColor: '#3F76E4',
        waterFogColor: '#050533',
        fogColor: '#C0D8FF',
        foliageColor: '#71A74D',
        grassColor: '#91BD59',
      },
      spawning: {
        spawnEntities: [],
      },
      features: {
        terrain: [],
        vegetation: [],
        structures: [],
        ores: [],
      },
      weight: 10,
    });
    setNewBiomeName('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            添加生物群系
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            value={newBiomeName}
            onChange={e => setNewBiomeName(e.target.value)}
            placeholder="输入生物群系名称"
            onKeyDown={e => e.key === 'Enter' && handleAddBiome()}
          />
          <Button onClick={handleAddBiome}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {project.biomes.map((biome: any) => (
          <Card key={biome.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{biome.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => deleteBiome(biome.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <CardDescription>ID: {biome.identifier}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>温度</Label>
                  <Slider 
                    value={[biome.climate.temperature]}
                    min={-1}
                    max={2}
                    step={0.1}
                    onValueChange={([v]) => updateBiome(biome.id, { 
                      climate: { ...biome.climate, temperature: v }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">{biome.climate.temperature}</p>
                </div>
                <div className="space-y-2">
                  <Label>降雨量</Label>
                  <Slider 
                    value={[biome.climate.downfall]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={([v]) => updateBiome(biome.id, { 
                      climate: { ...biome.climate, downfall: v }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">{biome.climate.downfall}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 生成Addon函数
async function generateAddon(project: any) {
  const zip = new JSZip();
  
  // 行为包
  const behaviorPack = zip.folder('behavior_pack');
  behaviorPack?.file('manifest.json', JSON.stringify({
    format_version: 2,
    header: {
      name: project.name,
      description: project.description,
      uuid: project.uuid,
      version: project.version.split('.').map(Number),
      min_engine_version: project.minEngineVersion,
    },
    modules: [{
      type: 'data',
      uuid: project.moduleUuid,
      version: project.version.split('.').map(Number),
    }],
  }, null, 2));

  // 实体行为
  const entitiesFolder = behaviorPack?.folder('entities');
  project.entities.forEach((entity: any) => {
    entitiesFolder?.file(`${entity.identifier}.json`, JSON.stringify({
      format_version: '1.20.0',
      'minecraft:entity': {
        description: {
          identifier: `custom:${entity.identifier}`,
          is_spawnable: true,
          is_summonable: true,
        },
        components: {
          'minecraft:health': {
            value: entity.behavior.health,
            max: entity.behavior.health,
          },
          'minecraft:movement': {
            value: entity.behavior.movementSpeed,
          },
          'minecraft:attack': {
            damage: entity.behavior.attackDamage,
          },
        },
      },
    }, null, 2));
  });

  // 资源包
  const resourcePack = zip.folder('resource_pack');
  resourcePack?.file('manifest.json', JSON.stringify({
    format_version: 2,
    header: {
      name: `${project.name} Resources`,
      description: project.description,
      uuid: project.dependencyUuid,
      version: project.version.split('.').map(Number),
      min_engine_version: project.minEngineVersion,
    },
    modules: [{
      type: 'resources',
      uuid: generateUUID(),
      version: project.version.split('.').map(Number),
    }],
    dependencies: [{
      uuid: project.uuid,
      version: project.version.split('.').map(Number),
    }],
  }, null, 2));

  // 纹理
  const texturesFolder = resourcePack?.folder('textures');
  project.textures.forEach((texture: any) => {
    const base64Data = texture.dataUrl.split(',')[1];
    const ext = texture.dataUrl.includes('image/png') ? 'png' : 'jpg';
    texturesFolder?.file(`${texture.name}.${ext}`, base64Data, { base64: true });
  });

  return await zip.generateAsync({ type: 'blob' });
}

function App() {
  const {
    project,
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
    addBiome,
    updateBiome,
    deleteBiome,
  } = useAddonProject();

  const {
    files,
    uploadTextures,
    removeTexture,
  } = useFileUpload();

  const [activeTab, setActiveTab] = useState('project');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateAddon(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_v${project.version}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请检查控制台');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">MC Addon Generator</h1>
                <p className="text-xs text-muted-foreground">v2.0 - Minecraft Addon生成器</p>
              </div>
            </div>
            <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
              <Download className="w-4 h-4" />
              {isGenerating ? '生成中...' : '下载Addon'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="project" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">项目</span>
            </TabsTrigger>
            <TabsTrigger value="entities" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">实体</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="gap-2">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">方块</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="gap-2">
              <Sword className="w-4 h-4" />
              <span className="hidden sm:inline">物品</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">资源</span>
            </TabsTrigger>
            <TabsTrigger value="biomes" className="gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">群系</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <TabsContent value="project" className="mt-0">
              <ProjectPage project={project} updateProject={updateProject} />
            </TabsContent>
            <TabsContent value="entities" className="mt-0">
              <EntitiesPage 
                project={project} 
                addEntity={addEntity} 
                updateEntity={updateEntity} 
                deleteEntity={deleteEntity} 
              />
            </TabsContent>
            <TabsContent value="blocks" className="mt-0">
              <BlocksPage 
                project={project} 
                addBlock={addBlock} 
                updateBlock={updateBlock} 
                deleteBlock={deleteBlock} 
              />
            </TabsContent>
            <TabsContent value="items" className="mt-0">
              <ItemsPage 
                project={project} 
                addItem={addItem} 
                updateItem={updateItem} 
                deleteItem={deleteItem} 
              />
            </TabsContent>
            <TabsContent value="resources" className="mt-0">
              <ResourcesPage 
                files={files} 
                uploadTextures={uploadTextures} 
                removeTexture={removeTexture} 
              />
            </TabsContent>
            <TabsContent value="biomes" className="mt-0">
              <BiomesPage 
                project={project} 
                addBiome={addBiome} 
                updateBiome={updateBiome} 
                deleteBiome={deleteBiome} 
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
