// Internationalization
const translations = {
  en: {
    title: 'Alloy Materials Database',
    subtitle: 'Material Properties (Primary: Al-Ni-Cu-Zr-Nb-Ta-W System)',
    elementNote: 'Note: Database supports elements beyond the primary 7-element system',
    search: 'Search',
    searchPlaceholder: 'Search materials or elements...',
    infoText: 'Tip: Select material type and property category, or use search to find specific materials',
    typeTitle: 'Material Type',
    propertyTitle: 'Property Category',
    loading: 'Loading...',
    noData: 'No matching data found',
    resultsCount: 'Found {count} results',
    githubLink: 'GitHub Repository',
    docsLink: 'Documentation',
    updateLabel: 'Data Updated:',
    viewDetails: 'View Details',
    closeDetails: 'Close',
    allProperties: 'All Properties',
    basicInfo: 'Basic Information',
    structureInfo: 'Structure Properties',
    thermoInfo: 'Thermodynamics Properties',
    mechInfo: 'Mechanics Properties',
    defectInfo: 'Defect Properties',
    noDataAvailable: 'No data available',
    plotData: 'Plot Data',
    export: {
      title: 'Export Data',
      format: 'Export Format',
      range: 'Export Range',
      properties: 'Properties to Export',
      execute: '📥 Export',
      cancel: 'Cancel',
      allMaterials: 'All materials',
      filteredResults: 'Current filtered results',
      selectedMaterials: 'Selected materials',
      searchPlaceholder: 'Search to select...',
      jsonDesc: 'Complete data with full structure',
      csvDesc: 'Spreadsheet format (flattened)',
      noDataToExport: 'No data to export',
      structure: 'Structure',
      thermodynamics: 'Thermodynamics',
      mechanics: 'Mechanics',
      defects: 'Defects'
    },
    type: {
      all: 'All',
      amorphous: 'Amorphous',
      'solid-solution': 'Alloy-Solid Solution',
      intermetallic: 'Alloy-Intermetallic',
      interface: 'Interface',
      element: 'Element'
    },
    property: {
      structure: 'Structure',
      thermodynamics: 'Thermodynamics',
      mechanics: 'Mechanics',
      defects: 'Defects'
    },
    table: {
      id: 'ID',
      name: 'Name',
      type: 'Type',
      elements: 'Elements',
      density: 'Density',
      latticeA: 'Lattice a',
      latticeB: 'Lattice b',
      latticeC: 'Lattice c',
      rdf: 'RDF',
      formationEnergy: 'Formation Energy',
      specificHeat: 'Specific Heat',
      mixingEnthalpy: 'Mixing Enthalpy',
      diffusionCoeff: 'Diffusion Coeff.',
      thermalExpansion: 'Thermal Expansion',
      elasticConstants: 'Elastic Constants',
      stressStrain: 'Stress-Strain',
      youngsModulus: "Young's Modulus",
      bulkModulus: 'Bulk Modulus',
      shearModulus: 'Shear Modulus',
      poissonsRatio: "Poisson's Ratio",
      vacancyEnergy: 'Vacancy Energy',
      interstitialEnergy: 'Interstitial Energy',
      stackingFault: 'Stacking Fault'
    }
  },
  zh: {
    title: '合金材料数据库',
    subtitle: '材料性能数据（主要关注：Al-Ni-Cu-Zr-Nb-Ta-W 体系）',
    elementNote: '说明：数据库支持主要7元素体系之外的其他元素',
    search: '搜索',
    searchPlaceholder: '搜索材料名称或元素...',
    infoText: '提示：选择材料类型和性质分类，或使用搜索功能查找特定材料',
    typeTitle: '材料类型',
    propertyTitle: '性质分类',
    loading: '加载中...',
    noData: '未找到匹配的数据',
    resultsCount: '找到 {count} 条结果',
    githubLink: 'GitHub 仓库',
    docsLink: '使用说明',
    updateLabel: '数据更新时间:',
    viewDetails: '查看详情',
    closeDetails: '关闭',
    allProperties: '所有性质',
    basicInfo: '基本信息',
    structureInfo: '结构性质',
    thermoInfo: '热力学性质',
    mechInfo: '力学性能',
    defectInfo: '缺陷性质',
    noDataAvailable: '无数据',
    plotData: '绘制数据',
    export: {
      title: '导出数据',
      format: '导出格式',
      range: '导出范围',
      properties: '导出属性',
      execute: '📥 导出',
      cancel: '取消',
      allMaterials: '全部材料',
      filteredResults: '当前筛选结果',
      selectedMaterials: '选择的材料',
      searchPlaceholder: '搜索以选择...',
      jsonDesc: '完整数据结构',
      csvDesc: '表格格式（扁平化）',
      noDataToExport: '没有可导出的数据',
      structure: '结构',
      thermodynamics: '热力学',
      mechanics: '力学',
      defects: '缺陷'
    },
    type: {
      all: '全部',
      amorphous: '非晶',
      'solid-solution': '合金-固溶体',
      intermetallic: '合金-金属间化合物',
      interface: '界面',
      element: '单质'
    },
    property: {
      structure: '结构信息',
      thermodynamics: '热力学/动力学',
      mechanics: '力学性能',
      defects: '缺陷性质'
    },
    table: {
      id: 'ID',
      name: '名称',
      type: '类型',
      elements: '元素',
      density: '密度',
      latticeA: '晶格常数 a',
      latticeB: '晶格常数 b',
      latticeC: '晶格常数 c',
      rdf: '径向分布函数',
      formationEnergy: '形成能',
      specificHeat: '比热容',
      mixingEnthalpy: '混合焓',
      diffusionCoeff: '扩散系数',
      thermalExpansion: '热膨胀系数',
      elasticConstants: '弹性常数',
      stressStrain: '应力-应变曲线',
      youngsModulus: '杨氏模量',
      bulkModulus: '体模量',
      shearModulus: '剪切模量',
      poissonsRatio: '泊松比',
      vacancyEnergy: '空位形成能',
      interstitialEnergy: '间隙形成能',
      stackingFault: '层错能'
    }
  }
};

// Global state
let allData = [];
let currentType = 'all';
let currentProperty = 'structure';
let currentLang = localStorage.getItem('lang') || 'en';

// Load the API mock
const script = document.createElement('script');
script.src = './api-mock.js';
document.head.appendChild(script);

script.onload = function() {
  initApp();
};

// Translation function
function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  return value;
}

// Update UI text with null checks
function updateUIText() {
  const setTextIfExists = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  
  const setPlaceholderIfExists = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
  };
  
  setTextIfExists('title', t('title'));
  setTextIfExists('subtitle', t('subtitle'));
  setTextIfExists('searchBtnText', t('search'));
  setTextIfExists('exportBtnText', t('export.execute'));
  setPlaceholderIfExists('q', t('searchPlaceholder'));
  setTextIfExists('infoText', t('infoText'));
  setTextIfExists('typeTitle', t('typeTitle'));
  setTextIfExists('propertyTitle', t('propertyTitle'));
  setTextIfExists('loading', t('loading'));
  setTextIfExists('githubLink', t('githubLink'));
  setTextIfExists('docsLink', t('docsLink'));
  setTextIfExists('updateLabel', t('updateLabel'));
  setTextIfExists('langText', currentLang === 'en' ? '中文' : 'English');
  
  // Export dialog translations - only if modal exists
  if (document.getElementById('exportTitle')) {
    setTextIfExists('exportTitle', t('export.title'));
    setTextIfExists('exportFormatTitle', t('export.format'));
    setTextIfExists('exportRangeTitle', t('export.range'));
    setTextIfExists('exportPropsTitle', t('export.properties'));
    setTextIfExists('jsonDesc', t('export.jsonDesc'));
    setTextIfExists('csvDesc', t('export.csvDesc'));
    setTextIfExists('rangeAll', t('export.allMaterials'));
    setTextIfExists('rangeFiltered', t('export.filteredResults'));
    setTextIfExists('rangeSelected', t('export.selectedMaterials'));
    setPlaceholderIfExists('selectorSearch', t('export.searchPlaceholder'));
    setTextIfExists('propStructureLabel', t('export.structure'));
    setTextIfExists('propThermodynamicsLabel', t('export.thermodynamics'));
    setTextIfExists('propMechanicsLabel', t('export.mechanics'));
    setTextIfExists('propDefectsLabel', t('export.defects'));
    setTextIfExists('exportExecuteBtn', t('export.execute'));
    setTextIfExists('exportCancelBtn', t('export.cancel'));
  }
  
  // Update data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  
  // Update date format
  const dateOptions = currentLang === 'zh' ? 
    { year: 'numeric', month: '2-digit', day: '2-digit', locale: 'zh-CN' } :
    { year: 'numeric', month: 'short', day: 'numeric', locale: 'en-US' };
  document.getElementById('updateTime').textContent = new Date().toLocaleDateString(
    currentLang === 'zh' ? 'zh-CN' : 'en-US'
  );
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  
  // Re-render table if data is loaded
  if (allData.length > 0) {
    filterAndDisplay();
  }
}

// V2 Data Helper Functions

// Format composition with subscript numbers (Al2Cu4 → Al₂Cu₄, a-Al2Cu3 → a-Al₂Cu₃)
function formatComposition(composition) {
  if (!composition) return '-';
  const subscripts = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
  // Handle interface notation (A/B or A2B3/C4D5)
  if (composition.includes('/')) {
    return composition.split('/').map(part => {
      // Preserve a- prefix for amorphous
      const hasPrefix = part.startsWith('a-');
      const comp = hasPrefix ? part.substring(2) : part;
      const formatted = comp.replace(/(\d+)/g, (match) => {
        return match.split('').map(d => subscripts[parseInt(d)]).join('');
      });
      return hasPrefix ? 'a-' + formatted : formatted;
    }).join('/');
  }
  // Handle amorphous prefix
  if (composition.startsWith('a-')) {
    const comp = composition.substring(2);
    return 'a-' + comp.replace(/(\d+)/g, (match) => {
      return match.split('').map(d => subscripts[parseInt(d)]).join('');
    });
  }
  // Regular composition
  return composition.replace(/(\d+)/g, (match) => {
    return match.split('').map(d => subscripts[parseInt(d)]).join('');
  });
}

// Get primary data (0K) for display
// Priority: 0K DFT > 0K DPA-3 > 0K DPA-1 > other 0K > first entry
function getPrimaryData(material) {
  if (!material.data || material.data.length === 0) return null;
  // Priority: 0K DFT > 0K DPA-3_* > 0K DPA-1_* > other 0K > first entry
  let primary = material.data.find(d => d.temperature === 0 && getSourceBase(d.source) === 'DFT');
  if (!primary) {
    primary = material.data.find(d => d.temperature === 0 && getSourceBase(d.source) === 'DPA-3');
  }
  if (!primary) {
    primary = material.data.find(d => d.temperature === 0 && getSourceBase(d.source) === 'DPA-1');
  }
  if (!primary) {
    primary = material.data.find(d => d.temperature === 0);
  }
  if (!primary) {
    primary = material.data[0]; // Fallback to first entry
  }
  return primary;
}

// Get all secondary data (non-primary temperatures/sources), sorted by source then temperature
function getSecondaryData(material) {
  if (!material.data || material.data.length <= 1) return [];
  const primary = getPrimaryData(material);
  const secondary = material.data.filter(d => d !== primary);
  
  // Sort by source base type (DFT > DPA-3_* > DPA-1_* > others) then by temperature (ascending)
  const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
  secondary.sort((a, b) => {
    const orderA = sourceOrder[getSourceBase(a.source)] || 99;
    const orderB = sourceOrder[getSourceBase(b.source)] || 99;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.temperature - b.temperature;
  });
  
  return secondary;
}

function hasDataValue(val) {
  if (val === null || val === undefined || val === '' || val === '-') return false;
  if (Array.isArray(val)) return val.some((item) => hasDataValue(item));
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return false;
    return keys.some((k) => hasDataValue(val[k]));
  }
  return true;
}

function selectBestDataEntry(material, category, keys) {
  if (!material.data || material.data.length === 0) return null;
  const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
  let best = null;
  let bestRank = Number.POSITIVE_INFINITY;

  for (const d of material.data) {
    const obj = d && d.properties ? (d.properties[category] || {}) : {};
    const hasAny = keys.some((k) => hasDataValue(obj[k]));
    if (!hasAny) continue;

    const sourceRank = sourceOrder[getSourceBase(d.source)] || 99;
    const tempRank = typeof d.temperature === 'number' ? d.temperature : 9999;
    const rank = sourceRank * 100000 + tempRank;

    if (rank < bestRank) {
      best = d;
      bestRank = rank;
    }
  }

  return best || getPrimaryData(material);
}

function selectBestDataByPredicate(material, predicate) {
  if (!material.data || material.data.length === 0) return null;
  const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
  let best = null;
  let bestRank = Number.POSITIVE_INFINITY;

  for (const d of material.data) {
    if (!predicate(d)) continue;
    const sourceRank = sourceOrder[getSourceBase(d.source)] || 99;
    const tempRank = typeof d.temperature === 'number' ? d.temperature : 9999;
    const rank = sourceRank * 100000 + tempRank;
    if (rank < bestRank) {
      best = d;
      bestRank = rank;
    }
  }

  return best;
}

function formatDataMeta(dataEntry) {
  if (!dataEntry) return '';
  const temp = (typeof dataEntry.temperature === 'number') ? (dataEntry.temperature + 'K') : '-';
  const src = normalizeSource(dataEntry.source || '-');
  return ' <span class="data-meta">(' + temp + ', ' + src + ')</span>';
}

// Check if material has data for V2 format
function hasV2Data(material) {
  return material.data && Array.isArray(material.data) && material.data.length > 0;
}

// Normalize material to V2 format (convert old format if needed)
function normalizeMaterial(material) {
  // If already V2 format, return as is
  if (hasV2Data(material)) {
    return material;
  }
  
  // Convert V1 format to V2 format
  return {
    id: material.id,
    name: material.name,
    type: material.type,
    composition: material.elements ? material.elements.join('') : '',
    elements: material.elements || [],
    atomCount: {},
    data: [{
      temperature: 0,
      source: 'DFT',
      properties: {
        structure: material.structure || {},
        thermodynamics: material.thermodynamics || {},
        mechanics: material.mechanics || {},
        defects: material.defects || {}
      }
    }]
  };
}

// Filter by element composition
function matchesElementFilter(material, query) {
  if (!query) return true;
  
  const cleanQuery = query.trim();
  if (!cleanQuery) return true;
  
  // Check if it's a composition query (contains digits)
  if (/\d/.test(cleanQuery)) {
    // Match exact composition (case-insensitive)
    const materialComp = material.composition ? material.composition.toLowerCase() : '';
    return materialComp.includes(cleanQuery.toLowerCase());
  }
  
  // Element filter - extract elements from composition and match
  // Extract element symbols from composition string (e.g., "Al3Zr3" -> ["Al", "Zr"])
  if (material.elements && Array.isArray(material.elements)) {
    // If elements array exists, use it
    return material.elements.some(el => el.toLowerCase() === cleanQuery.toLowerCase());
  } else if (material.composition) {
    // Extract elements from composition string
    // Match element symbols: uppercase letter followed by optional lowercase letter
    const elementPattern = /[A-Z][a-z]?/g;
    const extractedElements = material.composition.match(elementPattern) || [];
    // Remove duplicates and check for match
    const uniqueElements = [...new Set(extractedElements)];
    return uniqueElements.some(el => el.toLowerCase() === cleanQuery.toLowerCase());
  }
  
  return false;
}

// Fuzzy match query against any source text (material-level and data-point-level)
function matchesSourceFilter(material, query) {
  if (!query) return true;

  const q = query.trim().toLowerCase();
  if (!q) return true;

  const candidates = [];
  const pushSource = (src) => {
    if (!src || typeof src !== 'string') return;
    candidates.push(src);
    candidates.push(normalizeSource(src) || '');
    candidates.push(formatSourceLabel(src, false) || '');
  };

  pushSource(material.source);

  if (Array.isArray(material.data)) {
    material.data.forEach(d => pushSource(d && d.source));
  }

  return candidates
    .filter(Boolean)
    .some(text => text.toLowerCase().includes(q));
}

async function initApp() {
  try {
    // Load all data
    const response = await fetch('./data/materials.json');
    if (!response.ok) {
      throw new Error('Failed to load materials data: ' + response.status);
    }
    const rawData = await response.json();
    
    // Normalize all materials to V2 format
    allData = applyTypeDisplayOrder(rawData.map(m => normalizeMaterial(m)));
    
    console.log('Loaded ' + allData.length + ' materials');
    
    // Initialize UI text
    updateUIText();
    
    // Bind events
    document.getElementById('search').onclick = () => filterAndDisplay();
    document.getElementById('q').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') filterAndDisplay();
    });
    
    // Language toggle
    document.getElementById('langToggle').addEventListener('click', function() {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('lang', currentLang);
      updateUIText();
    });
    
    // Material type tabs
    document.querySelectorAll('.type-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentType = this.dataset.type;
        filterAndDisplay();
      });
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    document.getElementById('table').innerHTML = '<div style="padding:20px;color:red;">Error loading data: ' + error.message + '<br>Please check browser console for details.</div>';
  }
  
  // Property category tabs
  document.querySelectorAll('.property-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.property-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentProperty = this.dataset.property;
      filterAndDisplay();
    });
  });
  
  // Initial display
  filterAndDisplay();
  
  // Event delegation for material detail links
  document.getElementById('table').addEventListener('click', function(e) {
    // Find closest material-link (handles clicks on child elements)
    const link = e.target.closest('.material-link');
    if (link) {
      e.preventDefault();
      const materialId = link.getAttribute('data-id');
      showDetail(materialId);
      return;
    }
    
    // Handle chart indicator clicks
    const chartLink = e.target.closest('.chart-indicator');
    if (chartLink) {
      e.preventDefault();
      const materialId = chartLink.getAttribute('data-material-id');
      const temperature = chartLink.getAttribute('data-temperature');
      const source = chartLink.getAttribute('data-source');
      console.log('Chart clicked:', { materialId, temperature, source, currentProperty });
      
      // Use currentProperty to determine which section to scroll to
      if (currentProperty === 'structure') {
        showDetail(materialId, 'structure', temperature, source);
      } else if (currentProperty === 'mechanics') {
        showDetail(materialId, 'mechanics', temperature, source);
      } else {
        // For other properties, just open detail without scrolling to chart
        showDetail(materialId);
      }
    }
  });
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', function() {
    openExportDialog();
  });
}

function applyTypeDisplayOrder(list) {
  const typeOrder = {
    'solid-solution': 0,
    'intermetallic': 1,
    'amorphous': 2,
    'interface': 3,
    'element': 4,
    'solid_solution': 0
  };
  return [...list].sort((a, b) => {
    const ta = typeOrder[a.type] ?? 999;
    const tb = typeOrder[b.type] ?? 999;
    if (ta !== tb) return ta - tb;
    return (a.name || '').localeCompare(b.name || '');
  });
}

function getPropertyCompletenessScore(material, propertyKey) {
  const entries = Array.isArray(material.data) && material.data.length > 0
    ? material.data.map((d) => (d && d.properties) ? d.properties : {})
    : [material.properties || material || {}];

  const hasAny = (getter) => entries.some((props) => hasDataValue(getter(props || {})));

  if (propertyKey === 'structure') {
    let score = 0;
    if (hasAny((p) => p.structure && p.structure.density)) score++;
    if (hasAny((p) => p.structure && p.structure.latticeParameters)) score++;
    if (hasAny((p) => p.structure && p.structure.rdf)) score++;
    return score;
  }

  if (propertyKey === 'thermodynamics') {
    let score = 0;
    if (hasAny((p) => {
      const th = p.thermodynamics || {};
      return th.specificHeat ?? th.specificHeat_v ?? th.specificHeat_p;
    })) score++;
    if (hasAny((p) => p.thermodynamics && p.thermodynamics.mixingEnthalpy)) score++;
    if (hasAny((p) => p.thermodynamics && p.thermodynamics.diffusionCoefficient)) score++;
    if (hasAny((p) => p.thermodynamics && p.thermodynamics.thermalExpansion)) score++;
    return score;
  }

  if (propertyKey === 'mechanics') {
    let score = 0;
    if (hasAny((p) => p.mechanics && p.mechanics.elasticConstants)) score++;
    if (hasAny((p) => p.mechanics && p.mechanics.youngsModulus)) score++;
    if (hasAny((p) => p.mechanics && p.mechanics.bulkModulus)) score++;
    if (hasAny((p) => p.mechanics && p.mechanics.shearModulus)) score++;
    if (hasAny((p) => p.mechanics && p.mechanics.poissonsRatio)) score++;
    if (hasAny((p) => p.mechanics && p.mechanics.stressStrain)) score++;
    return score;
  }

  if (propertyKey === 'defects') {
    let score = 0;
    if (hasAny((p) => p.defects && p.defects.vacancyFormationEnergy)) score++;
    if (hasAny((p) => p.defects && p.defects.interstitialFormationEnergy)) score++;
    if (hasAny((p) => p.defects && p.defects.stackingFaultEnergy)) score++;
    return score;
  }

  return 0;
}

function sortForCurrentView(list) {
  const typeOrder = {
    'solid-solution': 0,
    'intermetallic': 1,
    'amorphous': 2,
    'interface': 3,
    'element': 4,
    'solid_solution': 0
  };

  return [...list].sort((a, b) => {
    if (currentType === 'all') {
      const ta = typeOrder[a.type] ?? 999;
      const tb = typeOrder[b.type] ?? 999;
      if (ta !== tb) return ta - tb;
    }

    const sa = getPropertyCompletenessScore(a, currentProperty);
    const sb = getPropertyCompletenessScore(b, currentProperty);
    if (sa !== sb) return sb - sa;

    return (a.name || '').localeCompare(b.name || '');
  });
}

function filterAndDisplay() {
  const searchTerm = document.getElementById('q').value.trim();
  
  // Filter data
  let filtered = allData;
  
  // Filter by type
  if (currentType !== 'all') {
    filtered = filtered.filter(item => item.type === currentType);
  }
  
  // Filter by search term (name, element composition, or source)
  if (searchTerm) {
    // Detect if search term is likely an element symbol (1-2 uppercase letters)
    const isElementSearch = /^[A-Z][a-z]?$/i.test(searchTerm);
    
    filtered = filtered.filter(item => {
      const matchesSource = matchesSourceFilter(item, searchTerm);
      if (isElementSearch) {
        // Keep element-priority behavior while allowing source fuzzy match.
        return matchesElementFilter(item, searchTerm) || matchesSource;
      } else {
        // For other searches, match in name, composition, or source.
        const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesElement = matchesElementFilter(item, searchTerm);
        return matchesName || matchesElement || matchesSource;
      }
    });
  }
  
  displayResults(sortForCurrentView(filtered));
}

function displayResults(data) {
  const container = document.getElementById('table');
  const noData = data.length === 0;
  
  // Calculate total data points (accounting for all properties in each temperature/source entry)
  function countDataProperties(dataPoint) {
    if (!dataPoint || !dataPoint.properties) return 0;
    
    let count = 0;
    const props = dataPoint.properties;
    
    // Structure properties
    if (props.structure) {
      if (hasDataValue(props.structure.density)) count++;
      if (hasDataValue(props.structure.latticeParameters)) count++;
      if (hasDataValue(props.structure.rdf)) count++;
    }
    
    // Thermodynamics properties
    if (props.thermodynamics) {
      if (hasDataValue(props.thermodynamics.specificHeat) || hasDataValue(props.thermodynamics.specificHeat_v) || hasDataValue(props.thermodynamics.specificHeat_p)) count++;
      if (hasDataValue(props.thermodynamics.mixingEnthalpy)) count++;
      if (hasDataValue(props.thermodynamics.diffusionCoefficient)) count++;
      if (hasDataValue(props.thermodynamics.thermalExpansion)) count++;
    }
    
    // Mechanics properties
    if (props.mechanics) {
      if (hasDataValue(props.mechanics.elasticConstants)) count++;
      if (hasDataValue(props.mechanics.youngsModulus)) count++;
      if (hasDataValue(props.mechanics.bulkModulus)) count++;
      if (hasDataValue(props.mechanics.shearModulus)) count++;
      if (hasDataValue(props.mechanics.poissonsRatio)) count++;
      if (hasDataValue(props.mechanics.stressStrain)) count++;
    }
    
    // Defects properties
    if (props.defects) {
      if (hasDataValue(props.defects.vacancyFormationEnergy)) count++;
      if (hasDataValue(props.defects.interstitialFormationEnergy)) count++;
      if (hasDataValue(props.defects.stackingFaultEnergy)) count++;
    }
    
    return count;
  }
  
  let totalDataPoints = 0;
  data.forEach(material => {
    if (material.data && Array.isArray(material.data)) {
      material.data.forEach(dataPoint => {
        totalDataPoints += countDataProperties(dataPoint);
      });
    } else {
      // V1 format - count available properties
      totalDataPoints += countDataProperties({ properties: material });
    }
  });
  
  const countText = currentLang === 'en' 
    ? `Found ${data.length} materials with ${totalDataPoints} data points`
    : `找到 ${data.length} 种材料，共 ${totalDataPoints} 条数据`;
  
  let html = '<div class="result-count">' + countText + '</div>';
  if (noData) {
    html += '<div class="data-note">' + (currentLang === 'en' ? 'No materials matched current filter; showing table template.' : '当前筛选下无材料数据，已显示表格模板。') + '</div>';
  }
  
  // Display different tables based on selected property category
  if (currentProperty === 'structure') {
    html += displayStructureTable(data);
  } else if (currentProperty === 'thermodynamics') {
    html += displayThermodynamicsTable(data);
  } else if (currentProperty === 'mechanics') {
    html += displayMechanicsTable(data);
  } else if (currentProperty === 'defects') {
    html += displayDefectsTable(data);
  }
  
  container.innerHTML = html;
  setTimeout(() => hydrateCharts(container), 0);
}

function displayStructureTable(data) {
  const hideLatticeColumn = shouldHideLatticeParameters(currentType);
  const hideDensityColumn = shouldHideStructureDensity(currentType);
  let html = '<div class="data-note">';
  html += currentLang === 'en' ? 
    'Note: Values shown are at 0K unless specified. Click row to expand other temperatures.' :
    '注：显示数值为0K下的数据（除非另有说明）。点击行可展开其他温度数据。';
  html += '</div>';
  
  html += '<div class="table-wrapper"><table><thead><tr>';
  html += '<th style="width:30px"></th>'; // Expand toggle
  html += '<th>' + t('table.id') + '</th>';
  html += '<th>' + t('table.name') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Source' : '来源') + '</th>';
  html += '<th>' + t('table.type') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Composition' : '元素组成') + '</th>';
  if (!hideDensityColumn) {
    html += '<th>' + t('table.density') + '<br/>(g/cm³)</th>';
  }
  if (!hideLatticeColumn) {
    html += '<th>' + (currentLang === 'en' ? 'Lattice Params' : '晶格参数') + '</th>';
  }
  html += '<th>' + t('table.rdf') + '</th>';
  html += '</tr></thead><tbody>';
  
  // Display materials with their Alloy IDs
  for (let idx = 0; idx < data.length; idx++) {
    const material = data[idx];
    const primary = getPrimaryData(material);
    const densityEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.structure?.density));
    const latticeEntry = selectBestDataByPredicate(material, (d) => {
      const lp = d?.properties?.structure?.latticeParameters;
      return !!lp && (hasDataValue(lp.a) || hasDataValue(lp.b) || hasDataValue(lp.c) || hasDataValue(lp.pointGroup));
    });
    const rdfEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.structure?.rdf));
    const secondary = getSecondaryData(material);
    const hasSecondary = secondary.length > 0;
    
    if (!primary) continue;
    
    const densityStruct = densityEntry ? ((densityEntry.properties || {}).structure || {}) : {};
    const latticeStruct = latticeEntry ? ((latticeEntry.properties || {}).structure || {}) : {};
    const rdfStruct = rdfEntry ? ((rdfEntry.properties || {}).structure || {}) : {};
    const hideLatticeParams = shouldHideLatticeParameters(material.type);
    
    // Main row
    html += '<tr class="material-row" data-id="' + material.id + '">';
    
    // Expand toggle
    html += '<td class="expand-cell">';
    if (hasSecondary) {
      html += '<button class="expand-btn" onclick="toggleExpand(this)">▶</button>';
    }
    html += '</td>';
    
    html += '<td>' + material.id + '</td>';
    html += '<td><a href="#" class="material-link" data-id="' + material.id + '">' + material.name + '</a></td>';
    html += '<td>' + formatSourceLabel(material.source) + '</td>';
    html += '<td>' + translateType(material.type) + '</td>';
    html += '<td class="composition">' + formatComposition(material.composition) + '</td>';
    if (!hideDensityColumn) {
      html += '<td>' + formatValue(densityStruct.density, 3);
      html += formatDataMeta(densityEntry);
      html += '</td>';
    }
    
    // Lattice parameters with dropdown (show even without pointGroup)
    if (!hideLatticeColumn) {
      html += '<td class="lattice-cell">';
      const lattice = latticeStruct.latticeParameters;
      if (!hideLatticeParams && lattice && (lattice.a || lattice.b || lattice.c)) {
        html += '<div class="lattice-display">';
        if (lattice.pointGroup && lattice.pointGroup.trim() !== '') {
          html += '<span class="point-group">' + lattice.pointGroup + '</span>';
        } else {
          html += '<span class="point-group">-</span>';
        }
        html += '<button class="lattice-expand" onclick="toggleLattice(this, event)">▼</button>';
        html += '</div>';
        html += '<div class="lattice-details hidden">';
        if (lattice.a) html += '<div>a = ' + formatValue(lattice.a, 3) + ' Å</div>';
        if (lattice.b) html += '<div>b = ' + formatValue(lattice.b, 3) + ' Å</div>';
        if (lattice.c) html += '<div>c = ' + formatValue(lattice.c, 3) + ' Å</div>';
        if (lattice.alpha) html += '<div>α = ' + formatValue(lattice.alpha, 1) + '°</div>';
        if (lattice.beta) html += '<div>β = ' + formatValue(lattice.beta, 1) + '°</div>';
        if (lattice.gamma) html += '<div>γ = ' + formatValue(lattice.gamma, 1) + '°</div>';
        html += '</div>';
      } else {
        html += '-';
      }
      html += '</td>';
    }
    
    html += '<td>' + formatFile(rdfStruct.rdf, material.id, rdfEntry ? rdfEntry.temperature : undefined, rdfEntry ? rdfEntry.source : undefined) + formatDataMeta(rdfEntry) + '</td>';
    html += '</tr>';
    
    // Expanded row for all data (sorted)
    if (hasSecondary) {
      // Get all data and sort by temperature first, then by source
      const allSortedData = [...material.data];
      const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5, 'Other': 99 };
      allSortedData.sort((a, b) => {
        // First: sort by temperature (ascending)
        if (a.temperature !== b.temperature) {
          return a.temperature - b.temperature;
        }
        // Second: sort by source base type (DFT > DPA-3_* > DPA-1_* > others)
        const orderA = sourceOrder[getSourceBase(a.source)] || 99;
        const orderB = sourceOrder[getSourceBase(b.source)] || 99;
        return orderA - orderB;
      });
      
      const temperatures = [...new Set(allSortedData.map(d => d.temperature))].sort((a, b) => a - b);
      // Get unique base source types for filtering (DPA-3_xxx all map to DPA-3)
      const sourceBases = [...new Set(allSortedData.map(d => getSourceBase(d.source)))];
      // Sort sources: DFT, DPA-3, DPA-1, Experiment, MD, Other
      const sources = sourceBases.sort((a, b) => (sourceOrder[a] || 99) - (sourceOrder[b] || 99));
      
      html += '<tr class="expanded-row hidden" data-parent-id="' + material.id + '">';
      html += '<td colspan="100%"><div class="expanded-content">';
      
      // Add selectors for temperature and source
      html += '<div class="expanded-selectors">';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label>';
      html += '<select class="expanded-temp-select" onchange="filterExpandedRows(this, \'structure\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      temperatures.forEach(temp => {
        html += '<option value="' + temp + '">' + temp + 'K</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Source:' : '来源:') + '</label>';
      html += '<select class="expanded-source-select" onchange="filterExpandedRows(this, \'structure\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      sources.forEach(src => {
        html += '<option value="' + src + '">' + src + '</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '</div>';
      
      html += '<table class="sub-table" data-material-id="' + material.id + '"><thead><tr>';
      html += '<th>' + (currentLang === 'en' ? 'Temperature' : '温度') + '</th>';
      html += '<th>' + (currentLang === 'en' ? 'Source' : '数据来源') + '</th>';
      if (!hideDensityColumn) {
        html += '<th>' + t('table.density') + '</th>';
      }
      if (!hideLatticeColumn) {
        html += '<th>' + (currentLang === 'en' ? 'Lattice' : '晶格') + '</th>';
      }
      html += '<th>' + t('table.rdf') + '</th>';
      html += '</tr></thead><tbody>';
      
      for (const dataPoint of allSortedData) {
        const p = dataPoint.properties || {};
        const s = p.structure || {};
        const lattice = s.latticeParameters;
        html += '<tr data-temperature="' + dataPoint.temperature + '" data-source="' + normalizeSource(dataPoint.source) + '">';
        html += '<td>' + dataPoint.temperature + 'K</td>';
        html += '<td>' + normalizeSource(dataPoint.source) + '</td>';
        if (!hideDensityColumn) {
          html += '<td>' + formatValue(s.density, 3) + '</td>';
        }
        
        // Lattice with dropdown
        if (!hideLatticeColumn) {
          html += '<td class="lattice-cell">';
          if (!hideLatticeParams && lattice && lattice.pointGroup) {
            html += '<div class="lattice-display">';
            html += '<span class="point-group">' + lattice.pointGroup + '</span>';
            html += '<button class="lattice-expand" onclick="toggleLattice(this, event)">▼</button>';
            html += '</div>';
            html += '<div class="lattice-details hidden">';
            if (lattice.a) html += '<div>a = ' + formatValue(lattice.a, 3) + ' Å</div>';
            if (lattice.b) html += '<div>b = ' + formatValue(lattice.b, 3) + ' Å</div>';
            if (lattice.c) html += '<div>c = ' + formatValue(lattice.c, 3) + ' Å</div>';
            if (lattice.alpha) html += '<div>α = ' + formatValue(lattice.alpha, 1) + '°</div>';
            if (lattice.beta) html += '<div>β = ' + formatValue(lattice.beta, 1) + '°</div>';
            if (lattice.gamma) html += '<div>γ = ' + formatValue(lattice.gamma, 1) + '°</div>';
            html += '</div>';
          } else {
            html += '-';
          }
          html += '</td>';
        }
        
        html += '<td>' + formatFile(s.rdf, material.id, dataPoint.temperature, dataPoint.source) + '</td>';
        html += '</tr>';
      }
      
      html += '</tbody></table></div></td></tr>';
    }
  }
  
  html += '</tbody></table></div>';
  return html;
}

function displayThermodynamicsTable(data) {
  let html = '<div class="data-note">';
  html += currentLang === 'en' ? 
    'Note: Values shown are at 0K unless specified. Click row to expand other temperatures.' :
    '注：显示数值为0K下的数据（除非另有说明）。点击行可展开其他温度数据。';
  html += '</div>';
  
  html += '<div class="table-wrapper"><table><thead><tr>';
  html += '<th style="width:30px"></th>';
  html += '<th>' + t('table.id') + '</th>';
  html += '<th>' + t('table.name') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Source' : '来源') + '</th>';
  html += '<th>' + t('table.type') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Composition' : '元素组成') + '</th>';
  html += '<th>' + t('table.specificHeat') + '<br/>(J/kg·K)</th>';
  html += '<th>' + t('table.mixingEnthalpy') + '<br/>(kJ/mol)</th>';
  html += '<th>' + t('table.diffusionCoeff') + '<br/>(m²/s)</th>';
  html += '<th>' + t('table.thermalExpansion') + '<br/>(10⁻⁶/K)</th>';
  html += '</tr></thead><tbody>';
  
  // Display materials with their Alloy IDs
  for (let idx = 0; idx < data.length; idx++) {
    const material = data[idx];
    const primary = getPrimaryData(material);
    const specificHeatEntry = selectBestDataByPredicate(material, (d) => {
      const th = d?.properties?.thermodynamics || {};
      return hasDataValue(th.specificHeat) || hasDataValue(th.specificHeat_v) || hasDataValue(th.specificHeat_p);
    });
    const mixingEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.thermodynamics?.mixingEnthalpy));
    const diffusionEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.thermodynamics?.diffusionCoefficient));
    const thermalExpansionEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.thermodynamics?.thermalExpansion));
    const secondary = getSecondaryData(material);
    const hasSecondary = secondary.length > 0;
    
    if (!primary) continue;
    
    const specificHeat = specificHeatEntry ? (((specificHeatEntry.properties || {}).thermodynamics) || {}) : {};
    const mixing = mixingEntry ? (((mixingEntry.properties || {}).thermodynamics) || {}) : {};
    const diffusion = diffusionEntry ? (((diffusionEntry.properties || {}).thermodynamics) || {}) : {};
    const thermalExp = thermalExpansionEntry ? (((thermalExpansionEntry.properties || {}).thermodynamics) || {}) : {};
    const hideMixingEnthalpy = shouldHideMixingEnthalpy(material.type);
    
    html += '<tr class="material-row" data-id="' + material.id + '">';
    
    html += '<td class="expand-cell">';
    if (hasSecondary) {
      html += '<button class="expand-btn" onclick="toggleExpand(this)">▶</button>';
    }
    html += '</td>';
    
    html += '<td>' + material.id + '</td>';
    html += '<td><a href="#" class="material-link" data-id="' + material.id + '">' + material.name + '</a></td>';
    html += '<td>' + formatSourceLabel(material.source) + '</td>';
    html += '<td>' + translateType(material.type) + '</td>';
    html += '<td class="composition">' + formatComposition(material.composition) + '</td>';
    html += '<td>' + formatSpecificHeatDisplay(specificHeat);
    html += formatDataMeta(specificHeatEntry);
    html += '</td>';
    if (hideMixingEnthalpy) {
      html += '<td>-</td>';
    } else {
      html += '<td>' + formatValue(mixing.mixingEnthalpy, 2) + formatDataMeta(mixingEntry) + '</td>';
    }
    html += '<td>' + formatScientific(diffusion.diffusionCoefficient) + formatDataMeta(diffusionEntry) + '</td>';
    html += '<td>' + formatScientific(thermalExp.thermalExpansion) + formatDataMeta(thermalExpansionEntry) + '</td>';
    html += '</tr>';
    
    if (hasSecondary) {
      // Get all data and sort by temperature first, then by source
      const allSortedData = [...material.data];
      const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
      allSortedData.sort((a, b) => {
        // First: sort by temperature (ascending)
        if (a.temperature !== b.temperature) {
          return a.temperature - b.temperature;
        }
        // Second: sort by source (DFT > DPA-3 > DPA-1)
        const orderA = sourceOrder[getSourceBase(a.source)] || 99;
        const orderB = sourceOrder[getSourceBase(b.source)] || 99;
        return orderA - orderB;
      });
      
      const temperatures = [...new Set(allSortedData.map(d => d.temperature))].sort((a, b) => a - b);
      const sources = [...new Set(allSortedData.map(d => d.source))].sort();
      
      html += '<tr class="expanded-row hidden" data-parent-id="' + material.id + '">';
      html += '<td colspan="100%"><div class="expanded-content">';
      
      html += '<div class="expanded-selectors">';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label>';
      html += '<select class="expanded-temp-select" onchange="filterExpandedRows(this, \'thermodynamics\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      temperatures.forEach(temp => {
        html += '<option value="' + temp + '">' + temp + 'K</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Source:' : '来源:') + '</label>';
      html += '<select class="expanded-source-select" onchange="filterExpandedRows(this, \'thermodynamics\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      sources.forEach(src => {
        html += '<option value="' + src + '">' + src + '</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '</div>';
      
      html += '<table class="sub-table" data-material-id="' + material.id + '"><thead><tr>';
      html += '<th>' + (currentLang === 'en' ? 'Temperature' : '温度') + '</th>';
      html += '<th>' + (currentLang === 'en' ? 'Source' : '数据来源') + '</th>';
      html += '<th>' + t('table.specificHeat') + '</th>';
      html += '<th>' + t('table.mixingEnthalpy') + '</th>';
      html += '<th>' + t('table.diffusionCoeff') + '</th>';
      html += '<th>' + t('table.thermalExpansion') + '</th>';
      html += '</tr></thead><tbody>';
      
      for (const dataPoint of allSortedData) {
        const p = dataPoint.properties || {};
        const th = p.thermodynamics || {};
        html += '<tr data-temperature="' + dataPoint.temperature + '" data-source="' + normalizeSource(dataPoint.source) + '">';
        html += '<td>' + dataPoint.temperature + 'K</td>';
        html += '<td>' + normalizeSource(dataPoint.source) + '</td>';
        html += '<td>' + formatSpecificHeatDisplay(th) + '</td>';
        html += '<td>' + (hideMixingEnthalpy ? '-' : formatValue(th.mixingEnthalpy, 2)) + '</td>';
        html += '<td>' + formatScientific(th.diffusionCoefficient) + '</td>';
        html += '<td>' + formatScientific(th.thermalExpansion) + '</td>';
        html += '</tr>';
      }
      
      html += '</tbody></table></div></td></tr>';
    }
  }
  
  html += '</tbody></table></div>';
  return html;
}

function displayMechanicsTable(data) {
  let html = '<div class="data-note">';
  html += currentLang === 'en' ? 
    'Note: Values shown are at 0K unless specified. Click row to expand other temperatures. Click elastic constants to view full Cij matrix.' :
    '注：显示数值为0K下的数据（除非另有说明）。点击行可展开其他温度数据。点击弹性常数可查看完整Cij矩阵。';
  html += '</div>';
  
  html += '<div class="table-wrapper"><table><thead><tr>';
  html += '<th style="width:30px"></th>';
  html += '<th>' + t('table.id') + '</th>';
  html += '<th>' + t('table.name') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Source' : '来源') + '</th>';
  html += '<th>' + t('table.type') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Composition' : '元素组成') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Elastic (GPa)' : '弹性常数') + '</th>';
  html += '<th>' + t('table.youngsModulus') + '<br/>(GPa)</th>';
  html += '<th>' + t('table.poissonsRatio') + '</th>';
  html += '<th>' + t('table.stressStrain') + '</th>';
  html += '</tr></thead><tbody>';
  
  // Display materials with their Alloy IDs
  for (let idx = 0; idx < data.length; idx++) {
    const material = data[idx];
    const primary = getPrimaryData(material);
    const elasticEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.mechanics?.elasticConstants));
    const youngEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.mechanics?.youngsModulus));
    const poissonEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.mechanics?.poissonsRatio));
    const stressEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.mechanics?.stressStrain));
    const secondary = getSecondaryData(material);
    const hasSecondary = secondary.length > 0;
    
    if (!primary) continue;
    
    const elasticMech = elasticEntry ? (((elasticEntry.properties || {}).mechanics) || {}) : {};
    const youngMech = youngEntry ? (((youngEntry.properties || {}).mechanics) || {}) : {};
    const poissonMech = poissonEntry ? (((poissonEntry.properties || {}).mechanics) || {}) : {};
    const stressMech = stressEntry ? (((stressEntry.properties || {}).mechanics) || {}) : {};
    const elastic = elasticMech.elasticConstants;
    const interfaceStressOnly = shouldShowOnlyStressStrain(material.type);
    
    html += '<tr class="material-row" data-id="' + material.id + '">';
    
    html += '<td class="expand-cell">';
    if (hasSecondary) {
      html += '<button class="expand-btn" onclick="toggleExpand(this)">▶</button>';
    }
    html += '</td>';
    
    html += '<td>' + material.id + '</td>';
    html += '<td><a href="#" class="material-link" data-id="' + material.id + '">' + material.name + '</a></td>';
    html += '<td>' + formatSourceLabel(material.source) + '</td>';
    html += '<td>' + translateType(material.type) + '</td>';
    html += '<td class="composition">' + formatComposition(material.composition) + '</td>';
    
    // Elastic constants with matrix view
    html += '<td class="elastic-cell">';
    if (!interfaceStressOnly && elastic && Array.isArray(elastic) && elastic.length === 6) {
      html += '<div class="elastic-display">';
      html += '<span>C₁₁=' + formatValue(elastic[0][0], 1) + '</span>';
      html += '<button class="matrix-expand" onclick="toggleMatrix(this, event)">📊</button>';
      html += '</div>';
      html += '<div class="matrix-details hidden"><table class="cij-matrix">';
      for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 6; j++) {
          const val = elastic[i][j];
          html += '<td>' + formatValue(val, 1) + '</td>';
        }
        html += '</tr>';
      }
      html += '</table></div>';
    } else {
      html += '-';
    }
    html += '</td>';
    
    if (interfaceStressOnly) {
      html += '<td>-</td>';
      html += '<td>-</td>';
    } else {
      html += '<td>' + formatValue(youngMech.youngsModulus, 2) + formatDataMeta(youngEntry);
      html += '</td>';
      html += '<td>' + formatValue(poissonMech.poissonsRatio, 3) + formatDataMeta(poissonEntry) + '</td>';
    }
    html += '<td>' + formatFile(stressMech.stressStrain, material.id, stressEntry ? stressEntry.temperature : undefined, stressEntry ? stressEntry.source : undefined) + formatDataMeta(stressEntry) + '</td>';
    html += '</tr>';
    
    if (hasSecondary) {
      // Get all data and sort by temperature first, then by source
      const allSortedData = [...material.data];
      const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
      allSortedData.sort((a, b) => {
        // First: sort by temperature (ascending)
        if (a.temperature !== b.temperature) {
          return a.temperature - b.temperature;
        }
        // Second: sort by source (DFT > DPA-3 > DPA-1)
        const orderA = sourceOrder[getSourceBase(a.source)] || 99;
        const orderB = sourceOrder[getSourceBase(b.source)] || 99;
        return orderA - orderB;
      });
      
      const temperatures = [...new Set(allSortedData.map(d => d.temperature))].sort((a, b) => a - b);
      const sources = [...new Set(allSortedData.map(d => d.source))].sort();
      
      html += '<tr class="expanded-row hidden" data-parent-id="' + material.id + '">';
      html += '<td colspan="100%"><div class="expanded-content">';
      
      html += '<div class="expanded-selectors">';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label>';
      html += '<select class="expanded-temp-select" onchange="filterExpandedRows(this, \'mechanics\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      temperatures.forEach(temp => {
        html += '<option value="' + temp + '">' + temp + 'K</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Source:' : '来源:') + '</label>';
      html += '<select class="expanded-source-select" onchange="filterExpandedRows(this, \'mechanics\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      sources.forEach(src => {
        html += '<option value="' + src + '">' + src + '</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '</div>';
      
      html += '<table class="sub-table" data-material-id="' + material.id + '"><thead><tr>';
      html += '<th>' + (currentLang === 'en' ? 'Temperature' : '温度') + '</th>';
      html += '<th>' + (currentLang === 'en' ? 'Source' : '数据来源') + '</th>';
      html += '<th>' + (currentLang === 'en' ? 'Elastic' : '弹性常数') + '</th>';
      html += '<th>' + t('table.youngsModulus') + '</th>';
      html += '<th>' + t('table.poissonsRatio') + '</th>';
      html += '<th>' + t('table.stressStrain') + '</th>';
      html += '</tr></thead><tbody>';
      
      for (const dataPoint of allSortedData) {
        const p = dataPoint.properties || {};
        const m = p.mechanics || {};
        const elastic = m.elasticConstants;
        html += '<tr data-temperature="' + dataPoint.temperature + '" data-source="' + normalizeSource(dataPoint.source) + '">';
        html += '<td>' + dataPoint.temperature + 'K</td>';
        html += '<td>' + normalizeSource(dataPoint.source) + '</td>';
        
        // Elastic constants with matrix view
        html += '<td class="elastic-cell">';
        if (!interfaceStressOnly && elastic && Array.isArray(elastic) && elastic.length === 6) {
          html += '<div class="elastic-display">';
          html += '<span>C₁₁=' + formatValue(elastic[0][0], 1) + '</span>';
          html += '<button class="matrix-expand" onclick="toggleMatrix(this, event)">📊</button>';
          html += '</div>';
          html += '<div class="matrix-details hidden"><table class="cij-matrix">';
          for (let i = 0; i < 6; i++) {
            html += '<tr>';
            for (let j = 0; j < 6; j++) {
              const val = elastic[i][j];
              html += '<td>' + formatValue(val, 1) + '</td>';
            }
            html += '</tr>';
          }
          html += '</table></div>';
        } else {
          html += '-';
        }
        html += '</td>';
        
        html += '<td>' + (interfaceStressOnly ? '-' : formatValue(m.youngsModulus, 2)) + '</td>';
        html += '<td>' + (interfaceStressOnly ? '-' : formatValue(m.poissonsRatio, 3)) + '</td>';
        html += '<td>' + formatFile(m.stressStrain, material.id, dataPoint.temperature, dataPoint.source) + '</td>';
        html += '</tr>';
      }
      
      html += '</tbody></table></div></td></tr>';
    }
  }
  
  html += '</tbody></table></div>';
  return html;
}

function displayDefectsTable(data) {
  const hideDefectColumns = shouldHideDefectProperties(currentType);
  let html = '<div class="data-note">';
  html += currentLang === 'en' ? 
    'Note: Values shown are at 0K unless specified. Click row to expand other temperatures. Interstitial shows all sites.' :
    '注：显示数值为0K下的数据（除非另有说明）。点击行可展开其他温度数据。间隙能显示所有位点。';
  html += '</div>';
  
  html += '<div class="table-wrapper"><table><thead><tr>';
  html += '<th style="width:30px"></th>';
  html += '<th>' + t('table.id') + '</th>';
  html += '<th>' + t('table.name') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Source' : '来源') + '</th>';
  html += '<th>' + t('table.type') + '</th>';
  html += '<th>' + (currentLang === 'en' ? 'Composition' : '元素组成') + '</th>';
  if (!hideDefectColumns) {
    html += '<th>' + t('table.vacancyEnergy') + '<br/>(eV)</th>';
    html += '<th>' + t('table.interstitialEnergy') + '<br/>(eV)</th>';
    html += '<th>' + t('table.stackingFault') + '<br/>(mJ/m²)</th>';
  }
  html += '</tr></thead><tbody>';

  if (hideDefectColumns) {
    html += '<tr><td colspan="6" class="no-data">' + getPropertyNotMeaningfulText() + '</td></tr>';
    html += '</tbody></table></div>';
    return html;
  }
  
  // Display materials with their Alloy IDs
  for (let idx = 0; idx < data.length; idx++) {
    const material = data[idx];
    const primary = getPrimaryData(material);
    const vacancyEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.defects?.vacancyFormationEnergy));
    const interstitialEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.defects?.interstitialFormationEnergy));
    const stackingEntry = selectBestDataByPredicate(material, (d) => hasDataValue(d?.properties?.defects?.stackingFaultEnergy));
    const secondary = getSecondaryData(material);
    const hasSecondary = secondary.length > 0;
    const hideDefectProps = shouldHideDefectProperties(material.type);
    
    if (!primary) continue;
    
    const vacancyDefects = vacancyEntry ? (((vacancyEntry.properties || {}).defects) || {}) : {};
    const interstitialDefects = interstitialEntry ? (((interstitialEntry.properties || {}).defects) || {}) : {};
    const stackingDefects = stackingEntry ? (((stackingEntry.properties || {}).defects) || {}) : {};
    
    html += '<tr class="material-row" data-id="' + material.id + '">';
    
    html += '<td class="expand-cell">';
    if (hasSecondary) {
      html += '<button class="expand-btn" onclick="toggleExpand(this)">▶</button>';
    }
    html += '</td>';
    
    html += '<td>' + material.id + '</td>';
    html += '<td><a href="#" class="material-link" data-id="' + material.id + '">' + material.name + '</a></td>';
    html += '<td>' + formatSourceLabel(material.source) + '</td>';
    html += '<td>' + translateType(material.type) + '</td>';
    html += '<td class="composition">' + formatComposition(material.composition) + '</td>';
    if (hideDefectProps) {
      html += '<td>' + getPropertyNotMeaningfulText() + '</td>';
    } else {
      html += '<td>' + formatValue(vacancyDefects.vacancyFormationEnergy, 3);
      html += formatDataMeta(vacancyEntry);
      html += '</td>';
    }
    
    // Interstitial with multiple sites
    html += '<td class="interstitial-cell">';
    if (hideDefectProps) {
      html += '-';
    } else if (interstitialDefects.interstitialFormationEnergy != null) {
      if (typeof interstitialDefects.interstitialFormationEnergy === 'object' && !Array.isArray(interstitialDefects.interstitialFormationEnergy)) {
        // Only show sites with non-null values.
        const sites = Object.entries(interstitialDefects.interstitialFormationEnergy)
          .filter(([, v]) => hasDataValue(v));
        if (sites.length > 0) {
          html += '<div class="interstitial-display">';
          html += '<span>' + sites[0][0] + ': ' + formatValue(sites[0][1], 3) + '</span>';
          if (sites.length > 1) {
            html += '<button class="sites-expand" onclick="toggleSites(this, event)">▼</button>';
            html += '<div class="sites-details hidden">';
            for (const [site, value] of sites.slice(1)) {
              html += '<div>' + site + ': ' + formatValue(value, 3) + ' eV</div>';
            }
            html += '</div>';
          }
          html += '</div>';
        } else {
          html += '-';
        }
      } else {
        html += formatValue(interstitialDefects.interstitialFormationEnergy, 3);
      }
    } else {
      html += '-';
    }
    if (!hideDefectProps) html += formatDataMeta(interstitialEntry);
    html += '</td>';
    
    // Stacking fault energy with multiple types
    html += '<td class="stacking-cell">';
    if (hideDefectProps) {
      html += '-';
    } else if (stackingDefects.stackingFaultEnergy != null) {
      if (typeof stackingDefects.stackingFaultEnergy === 'object' && !Array.isArray(stackingDefects.stackingFaultEnergy)) {
        const types = Object.entries(stackingDefects.stackingFaultEnergy)
          .filter(([, v]) => hasDataValue(v));
        if (types.length > 0) {
          html += '<div class="stacking-display">';
          html += '<span>' + types[0][0] + ': ' + formatValue(types[0][1], 2) + '</span>';
          if (types.length > 1) {
            html += '<button class="sites-expand" onclick="toggleSites(this, event)">▼</button>';
            html += '<div class="sites-details hidden">';
            for (const [type, value] of types.slice(1)) {
              html += '<div>' + type + ': ' + formatValue(value, 2) + ' mJ/m²</div>';
            }
            html += '</div>';
          }
          html += '</div>';
        } else {
          html += '-';
        }
      } else {
        html += formatValue(stackingDefects.stackingFaultEnergy, 2);
      }
    } else {
      html += '-';
    }
    if (!hideDefectProps) html += formatDataMeta(stackingEntry);
    html += '</td>';
    html += '</tr>';
    
    if (hasSecondary) {
      // Get all data and sort by temperature first, then by source
      const allSortedData = [...material.data];
      const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
      allSortedData.sort((a, b) => {
        // First: sort by temperature (ascending)
        if (a.temperature !== b.temperature) {
          return a.temperature - b.temperature;
        }
        // Second: sort by source (DFT > DPA-3 > DPA-1)
        const orderA = sourceOrder[getSourceBase(a.source)] || 99;
        const orderB = sourceOrder[getSourceBase(b.source)] || 99;
        return orderA - orderB;
      });
      
      const temperatures = [...new Set(allSortedData.map(d => d.temperature))].sort((a, b) => a - b);
      const sources = [...new Set(allSortedData.map(d => d.source))].sort();
      
      html += '<tr class="expanded-row hidden" data-parent-id="' + material.id + '">';
      html += '<td colspan="100%"><div class="expanded-content">';
      
      html += '<div class="expanded-selectors">';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label>';
      html += '<select class="expanded-temp-select" onchange="filterExpandedRows(this, \'defects\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      temperatures.forEach(temp => {
        html += '<option value="' + temp + '">' + temp + 'K</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '<div class="selector-group">';
      html += '<label>' + (currentLang === 'en' ? 'Source:' : '来源:') + '</label>';
      html += '<select class="expanded-source-select" onchange="filterExpandedRows(this, \'defects\', ' + material.id + ')">';
      html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
      sources.forEach(src => {
        html += '<option value="' + src + '">' + src + '</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '</div>';
      
      html += '<table class="sub-table" data-material-id="' + material.id + '"><thead><tr>';
      html += '<th>' + (currentLang === 'en' ? 'Temperature' : '温度') + '</th>';
      html += '<th>' + (currentLang === 'en' ? 'Source' : '数据来源') + '</th>';
      html += '<th>' + t('table.vacancyEnergy') + '</th>';
      html += '<th>' + t('table.interstitialEnergy') + '</th>';
      html += '<th>' + t('table.stackingFault') + '</th>';
      html += '</tr></thead><tbody>';
      
      for (const dataPoint of allSortedData) {
        const p = dataPoint.properties || {};
        const d = p.defects || {};
        html += '<tr data-temperature="' + dataPoint.temperature + '" data-source="' + normalizeSource(dataPoint.source) + '">';
        html += '<td>' + dataPoint.temperature + 'K</td>';
        html += '<td>' + normalizeSource(dataPoint.source) + '</td>';
        html += '<td>' + (hideDefectProps ? getPropertyNotMeaningfulText() : formatValue(d.vacancyFormationEnergy, 3)) + '</td>';
        html += '<td>';
        if (hideDefectProps) {
          html += '-';
        } else if (d.interstitialFormationEnergy != null && typeof d.interstitialFormationEnergy === 'object' && !Array.isArray(d.interstitialFormationEnergy)) {
          const sites = Object.entries(d.interstitialFormationEnergy).filter(([, v]) => hasDataValue(v));
          if (sites.length > 0) {
            html += sites.map(([s, v]) => s + ':' + formatValue(v, 3)).join(', ');
          } else {
            html += '-';
          }
        } else if (d.interstitialFormationEnergy != null) {
          html += formatValue(d.interstitialFormationEnergy, 3);
        } else {
          html += '-';
        }
        html += '</td>';
        html += '<td>';
        if (hideDefectProps) {
          html += '-';
        } else if (d.stackingFaultEnergy != null && typeof d.stackingFaultEnergy === 'object' && !Array.isArray(d.stackingFaultEnergy)) {
          const types = Object.entries(d.stackingFaultEnergy).filter(([, v]) => hasDataValue(v));
          if (types.length > 0) {
            html += types.map(([t, v]) => t + ':' + formatValue(v, 2)).join(', ');
          } else {
            html += '-';
          }
        } else if (d.stackingFaultEnergy != null) {
          html += formatValue(d.stackingFaultEnergy, 2);
        } else {
          html += '-';
        }
        html += '</td>';
        html += '</tr>';
      }
      
      html += '</tbody></table></div></td></tr>';
    }
  }
  
  html += '</tbody></table></div>';
  return html;
}

function formatValue(val, decimals = 2) {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'number') return val.toFixed(decimals);
  return val;
}

function formatScientific(val, digits = 2) {
  if (val === null || val === undefined || val === '') return '-';

  if (typeof val === 'number') {
    return Number.isFinite(val) ? val.toExponential(digits) : '-';
  }

  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      const parts = val.map(v => formatScientific(v, digits)).filter(v => v !== '-');
      return parts.length ? parts.join(', ') : '-';
    }

    const parts = Object.entries(val)
      .filter(([, v]) => hasDataValue(v))
      .map(([k, v]) => k + ': ' + formatScientific(v, digits));
    return parts.length ? parts.join(', ') : '-';
  }

  const n = Number(val);
  if (Number.isFinite(n)) return n.toExponential(digits);
  return String(val);
}

function isHttpUrl(value) {
  if (!value || typeof value !== 'string') return false;
  return /^https?:\/\//i.test(value);
}

function isDoiSource(value) {
  if (!value || typeof value !== 'string') return false;
  return /^10\.\d{4,9}\/\S+$/i.test(value) || /doi\.org\//i.test(value);
}

function extractDoi(value) {
  if (!value || typeof value !== 'string') return null;
  const m = value.match(/10\.\d{4,9}\/\S+/i);
  return m ? m[0] : null;
}

function formatSourceLabel(source, asHtml = true) {
  if (!source) return '-';
  if (isHttpUrl(source)) {
    if (/doi\.org\//i.test(source)) {
      const doi = extractDoi(source);
      if (doi) {
        if (!asHtml) return 'DOI: ' + doi;
        return '<a href="https://doi.org/' + doi + '" target="_blank" rel="noopener noreferrer">DOI: ' + doi + '</a>';
      }
    }
    try {
      const u = new URL(source);
      const text = 'Reference (' + u.hostname + ')';
      if (!asHtml) return text;
      return '<a href="' + source + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
    } catch (e) {
      return source;
    }
  }
  if (isDoiSource(source)) {
    const doi = extractDoi(source);
    if (doi) {
      if (!asHtml) return 'DOI: ' + doi;
      return '<a href="https://doi.org/' + doi + '" target="_blank" rel="noopener noreferrer">DOI: ' + doi + '</a>';
    }
  }
  return normalizeSource(source);
}

function formatSpecificHeatDisplay(thermo) {
  if (!thermo || typeof thermo !== 'object') return '-';
  if (hasDataValue(thermo.specificHeat)) {
    return formatValue(thermo.specificHeat, 2);
  }
  const cv = thermo.specificHeat_v;
  const cp = thermo.specificHeat_p;
  const hasCv = hasDataValue(cv);
  const hasCp = hasDataValue(cp);
  if (hasCv && hasCp) {
    return 'C_v ' + formatValue(cv, 2) + ' / C_p ' + formatValue(cp, 2);
  }
  if (hasCv) {
    return 'C_v ' + formatValue(cv, 2);
  }
  if (hasCp) {
    return 'C_p ' + formatValue(cp, 2);
  }
  return '-';
}

// Normalize source format: DPA3_xxx -> DPA-3_xxx, DPA1_xxx -> DPA-1_xxx
function normalizeSource(source) {
  if (!source) return source;
  if (isHttpUrl(source)) {
    if (/doi\.org\//i.test(source)) {
      const doi = extractDoi(source);
      return doi ? 'DOI: ' + doi : source;
    }
    try {
      const u = new URL(source);
      return 'Reference (' + u.hostname + ')';
    } catch (e) {
      return source;
    }
  }
  if (isDoiSource(source)) {
    const doi = extractDoi(source);
    return doi ? 'DOI: ' + doi : source;
  }
  // Replace DPA3 with DPA-3, DPA1 with DPA-1
  return source.replace(/DPA(\d)/g, 'DPA-$1');
}

// Get base source type for sorting/filtering: DPA-3_final -> DPA-3, DPA-1_251208 -> DPA-1
function getSourceBase(source) {
  if (!source) return 'Other';
  const normalized = normalizeSource(source);
  // Extract base type (DFT, DPA-3, DPA-1, etc.)
  if (normalized === 'DFT') return 'DFT';
  if (normalized.startsWith('DPA-3')) return 'DPA-3';
  if (normalized.startsWith('DPA-1')) return 'DPA-1';
  if (normalized.startsWith('Experiment')) return 'Experiment';
  if (normalized.startsWith('MD')) return 'MD';
  return 'Other';
}

function formatFile(file, materialId, temperature, source) {
  if (!file) return '-';
  if (typeof file === 'string' && file.trim() === '') return '-';
  // If file is an array (RDF or stress-strain data), show chart indicator with click
  if (Array.isArray(file)) {
    return '<a href="#" class="chart-indicator" data-material-id="' + materialId + '" data-temperature="' + temperature + '" data-source="' + source + '">📊 Chart</a>';
  }
  // Object can represent multi-direction stress-strain datasets
  if (typeof file === 'object') {
    return '<a href="#" class="chart-indicator" data-material-id="' + materialId + '" data-temperature="' + temperature + '" data-source="' + source + '">📊 Chart</a>';
  }
  // If file is a string (URL/path)
  if (typeof file === 'string') {
    // Text data files are parsed into charts in detail view
    if (/\.(txt|dat|csv)(\?|$)/i.test(file)) {
      return '<a href="#" class="chart-indicator" data-material-id="' + materialId + '" data-temperature="' + temperature + '" data-source="' + source + '">📊 Chart</a>';
    }
    const filename = file.split('/').pop();
    return '<a href="' + file + '" target="_blank">📄 ' + filename + '</a>';
  }
  return '-';
}

function translateType(type) {
  const typeMap = {
    en: {
      'amorphous': 'Amorphous',
      'solid-solution': 'Alloy-Solid Solution',
      'intermetallic': 'Alloy-Intermetallic',
      'interface': 'Interface',
      'element': 'Element',
      'crystalline': 'Crystalline'
    },
    zh: {
      'amorphous': '非晶态',
      'solid-solution': '合金-固溶体',
      'intermetallic': '合金-金属间化合物',
      'interface': '界面',
      'element': '单质',
      'crystalline': '晶态'
    }
  };
  return typeMap[currentLang][type] || type;
}

function normalizeMaterialType(type) {
  if (type === 'solid_solution') return 'solid-solution';
  return type;
}

function shouldApplyTypeSpecificHiding() {
  return normalizeMaterialType(currentType) !== 'all';
}

function shouldHideLatticeParameters(type) {
  if (!shouldApplyTypeSpecificHiding()) return false;
  const normalized = normalizeMaterialType(type);
  return normalized === 'amorphous' || normalized === 'interface';
}

function shouldHideMixingEnthalpy(type) {
  if (!shouldApplyTypeSpecificHiding()) return false;
  const normalized = normalizeMaterialType(type);
  return normalized === 'amorphous' || normalized === 'interface';
}

function shouldHideStructureDensity(type) {
  if (!shouldApplyTypeSpecificHiding()) return false;
  return normalizeMaterialType(type) === 'interface';
}

function shouldShowOnlyStressStrain(type) {
  if (!shouldApplyTypeSpecificHiding()) return false;
  return normalizeMaterialType(type) === 'interface';
}

function shouldHideDefectProperties(type) {
  if (!shouldApplyTypeSpecificHiding()) return false;
  const normalized = normalizeMaterialType(type);
  return normalized === 'amorphous' || normalized === 'interface';
}

function getPropertyNotMeaningfulText() {
  return currentLang === 'en'
    ? 'This property category lacks physical meaning for this material system.'
    : '该材料体系下该性质缺乏物理意义';
}

// Toggle row expansion for multi-temperature data
window.toggleExpand = function(btn) {
  const mainRow = btn.closest('tr');
  const materialId = mainRow.dataset.id;
  const expandedRow = document.querySelector('.expanded-row[data-parent-id="' + materialId + '"]');
  
  if (expandedRow) {
    const isExpanded = !expandedRow.classList.contains('hidden');
    expandedRow.classList.toggle('hidden');
    btn.textContent = isExpanded ? '▶' : '▼';
  }
};

// Toggle lattice parameters dropdown
window.toggleLattice = function(btn, event) {
  event.stopPropagation();
  const cell = btn.closest('.lattice-cell');
  const details = cell.querySelector('.lattice-details');
  if (details) {
    const isHidden = details.classList.contains('hidden');
    details.classList.toggle('hidden');
    btn.textContent = isHidden ? '▲' : '▼';
    // Adjust z-index to prevent content overlap
    cell.style.zIndex = isHidden ? '100' : '1';
  }
};

// Toggle Cij matrix display
window.toggleMatrix = function(btn, event) {
  event.stopPropagation();
  const cell = btn.closest('.elastic-cell');
  const details = cell.querySelector('.matrix-details');
  if (details) {
    const isHidden = details.classList.contains('hidden');
    details.classList.toggle('hidden');
    btn.textContent = isHidden ? '✖' : '📊';
    // Adjust z-index to prevent content overlap
    cell.style.zIndex = isHidden ? '100' : '1';
  }
};

// Toggle interstitial sites display
window.toggleSites = function(btn, event) {
  event.stopPropagation();
  // Support both interstitial-cell and stacking-cell
  const cell = btn.closest('.interstitial-cell, .stacking-cell');
  if (!cell) return;
  const details = cell.querySelector('.sites-details');
  if (details) {
    const isHidden = details.classList.contains('hidden');
    details.classList.toggle('hidden');
    btn.textContent = isHidden ? '▲' : '▼';
    // Adjust z-index to prevent content overlap
    cell.style.zIndex = isHidden ? '100' : '1';
  }
};

// Filter expanded rows by temperature and/or source
window.filterExpandedRows = function(selectElement, tableType, materialId) {
  const expandedRow = selectElement.closest('.expanded-content');
  const tempSelect = expandedRow.querySelector('.expanded-temp-select');
  const sourceSelect = expandedRow.querySelector('.expanded-source-select');
  const table = expandedRow.querySelector('.sub-table[data-material-id="' + materialId + '"]');
  
  if (!table || !tempSelect || !sourceSelect) return;
  
  const selectedTemp = tempSelect.value;
  const selectedSource = sourceSelect.value;
  
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const rowTemp = row.getAttribute('data-temperature');
    const rowSource = row.getAttribute('data-source');
    
    let showRow = true;
    if (selectedTemp !== 'all' && rowTemp !== selectedTemp) {
      showRow = false;
    }
    // Match by base source type: DPA-3 matches DPA-3, DPA-3_final, DPA-3_xxx
    if (selectedSource !== 'all') {
      const rowSourceBase = getSourceBase(rowSource);
      if (rowSourceBase !== selectedSource) {
        showRow = false;
      }
    }
    
    row.style.display = showRow ? '' : 'none';
  });
};

// View 3D structure from expandable row
window.view3DStructure = function(materialId, temperature, source) {
  const material = allData.find(m => m.id == materialId);
  if (!material) return;
  
  // Find the specific data point
  let dataPoint;
  if (temperature && source) {
    dataPoint = material.data.find(d => 
      d.temperature == temperature && d.source === source
    );
  }
  
  // If not found or no filters, use primary data
  if (!dataPoint) {
    dataPoint = getPrimaryData(material);
  }
  
  if (!dataPoint) return;
  
  // Open detail modal
  showDetail(materialId);
  
  // Wait for modal to render, then scroll to 3D viewer
  setTimeout(() => {
    const viewerContainer = document.querySelector('.structure-viewer-container');
    if (viewerContainer) {
      viewerContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, 300);
};

// Show material detail in modal
window.showDetail = function(materialId, scrollToSection, targetTemperature, targetSource) {
  const material = allData.find(m => m.id == materialId);
  if (!material) return;
  
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  
  if (!material.data || material.data.length === 0) {
    content.innerHTML = '<p>No data available for this material.</p>';
    modal.style.display = 'block';
    return;
  }
  
  let html = '<h2>' + material.name + '</h2>';
  
  // Data Source Selector for multi-temperature/source
  if (material.data && material.data.length > 1) {
    // Get unique temperatures and base source types
    const temperatures = [...new Set(material.data.map(d => d.temperature))].sort((a, b) => a - b);
    const sourceBases = [...new Set(material.data.map(d => getSourceBase(d.source)))];
    const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5, 'Other': 99 };
    const sources = sourceBases.sort((a, b) => (sourceOrder[a] || 99) - (sourceOrder[b] || 99));
    
    html += '<div class="data-selector">';
    
    // Temperature selector
    html += '<div class="selector-group">';
    html += '<label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label>';
    html += '<select id="tempSelect-' + materialId + '" onchange="filterDetailData(\'' + materialId + '\')">';
    html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
    temperatures.forEach(temp => {
      html += '<option value="' + temp + '">' + temp + 'K</option>';
    });
    html += '</select>';
    html += '</div>';
    
    // Source selector
    html += '<div class="selector-group">';
    html += '<label>' + (currentLang === 'en' ? 'Source:' : '来源:') + '</label>';
    html += '<select id="sourceSelect-' + materialId + '" onchange="filterDetailData(\'' + materialId + '\')">';
    html += '<option value="all">' + (currentLang === 'en' ? 'All' : '全部') + '</option>';
    sources.forEach(src => {
      html += '<option value="' + src + '">' + src + '</option>';
    });
    html += '</select>';
    html += '</div>';
    
    html += '</div>';
  }
  
  html += '<div id="detailDataView">';
  // Default: show all data (temperature: all, source: all)
  html += generateAllDataView(material, material.data);
  html += '</div>';
  
  content.innerHTML = html;
  modal.style.display = 'block';
  setTimeout(() => hydrateCharts(content), 0);
  
  // Initialize 3D viewer if POSCAR exists (check material.poscar at top level)
  const firstData = material.data[0];
  const struct = firstData.properties?.structure;
  // Check poscar at material top level (for intermetallic data)
  const poscarPath = material.poscar || struct?.poscar;
  console.log('POSCAR Debug:', {
    materialId: material.id,
    materialPoscar: material.poscar,
    structPoscar: struct?.poscar,
    finalPath: poscarPath
  });
  if (poscarPath) {
    setTimeout(() => init3DViewer(materialId, poscarPath), 100);
  } else {
    console.log('No POSCAR path found for material:', material.id);
  }
  
  // Scroll to specified section if provided
  if (scrollToSection && targetTemperature && targetSource) {
    console.log('Scroll params:', { scrollToSection, targetTemperature, targetSource, materialId });
    setTimeout(() => {
      // Find the matching data point index
      const sortedData = [...material.data].sort((a, b) => a.temperature - b.temperature);
      console.log('Sorted data:', sortedData.map(d => ({ temp: d.temperature, source: d.source })));
      
      // Convert targetTemperature to number for comparison
      const targetTempNum = parseFloat(targetTemperature);
      const targetIdx = sortedData.findIndex(d => 
        d.temperature === targetTempNum && d.source === targetSource
      );
      
      console.log('Target index:', targetIdx, 'Looking for:', { temp: targetTempNum, source: targetSource });
      
      if (targetIdx !== -1) {
        // Find the chart with matching ID
        const chartPrefix = scrollToSection === 'structure' ? 'rdf' : 'stress';
        const targetChartId = chartPrefix + '-' + materialId + '-' + targetIdx;
        const targetChart = content.querySelector('#' + targetChartId);
        
        console.log('Looking for chart:', targetChartId, 'Found:', !!targetChart);
        
        if (targetChart) {
          console.log('Scrolling to chart:', targetChartId);
          targetChart.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.log('Chart not found, using fallback');
          // Fallback to first chart
          const firstChart = content.querySelector('.chart-canvas');
          if (firstChart) {
            firstChart.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else {
        console.log('Target data point not found, using fallback');
        // Fallback to first chart
        const firstChart = content.querySelector('.chart-canvas');
        if (firstChart) {
          firstChart.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 600);
  }
};

// Filter detail data by temperature or source
window.filterDetailData = function(materialId) {
  const material = allData.find(m => m.id == materialId);
  if (!material) return;
  
  const tempSelect = document.getElementById('tempSelect-' + materialId);
  const sourceSelect = document.getElementById('sourceSelect-' + materialId);
  
  if (!tempSelect || !sourceSelect) return;
  
  const selectedTemp = tempSelect.value;
  const selectedSource = sourceSelect.value;
  
  // Filter data based on selections
  let filteredData = material.data;
  
  if (selectedTemp !== 'all') {
    filteredData = filteredData.filter(d => d.temperature == selectedTemp);
  }
  
  // Match by base source type: DPA-3 matches DPA-3, DPA-3_final, DPA-3_xxx
  if (selectedSource !== 'all') {
    filteredData = filteredData.filter(d => getSourceBase(d.source) === selectedSource);
  }
  
  // Generate view for filtered data
  const container = document.getElementById('detailDataView');
  if (!container) return;
  
  // Check if no data matches the filter
  if (filteredData.length === 0) {
    const noDataMsg = currentLang === 'en' 
      ? 'No data available for the selected temperature and source combination.'
      : '所选温度和数据来源组合无可用数据。';
    container.innerHTML = '<div class="no-data-message" style="padding: 40px; text-align: center; color: #999; font-size: 16px;">' + noDataMsg + '</div>';
    return;
  }
  
  // Always use the grouped view format, regardless of filter selection
  container.innerHTML = generateAllDataView(material, filteredData);
  setTimeout(() => hydrateCharts(container), 0);
  
  // Re-initialize 3D viewers if needed - check material.poscar or struct.poscar
  const firstData = filteredData[0];
  const poscarPath = material.poscar || firstData?.properties?.structure?.poscar;
  if (poscarPath) {
    setTimeout(() => init3DViewer(materialId, poscarPath), 100);
  }
};

// Generate view for all data (when temperature: all, source: all)
function generateAllDataView(material, allDataPoints) {
  // Sort data: temperature ascending, then by source priority
  const sortedData = [...allDataPoints];
  const sourceOrder = { 'DFT': 1, 'DPA-3': 2, 'DPA-1': 3, 'Experiment': 4, 'MD': 5 };
  sortedData.sort((a, b) => {
    if (a.temperature !== b.temperature) {
      return a.temperature - b.temperature;
    }
    const orderA = sourceOrder[getSourceBase(a.source)] || 99;
    const orderB = sourceOrder[getSourceBase(b.source)] || 99;
    return orderA - orderB;
  });
  
  let html = '';
  
  // Use first data point for basic info and atomic structure (common across all)
  const firstData = sortedData[0];
  const firstProps = firstData.properties || {};
  const firstStruct = firstProps.structure || {};
  
  // Basic Information (置顶，所有数据点共同)
  html += '<div class="detail-section">';
  html += '<h3>' + t('basicInfo') + '</h3>';
  html += '<div class="detail-grid">';
  html += '<div class="detail-item"><label>ID:</label><span>' + material.id + '</span></div>';
  html += '<div class="detail-item"><label>' + t('table.name') + ':</label><span>' + material.name + '</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Source:' : '数据来源:') + '</label><span>' + formatSourceLabel(material.source || material.id) + '</span></div>';
  html += '<div class="detail-item"><label>' + t('table.type') + ':</label><span>' + translateType(material.type) + '</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Composition:' : '元素组成:') + '</label><span>' + formatComposition(material.composition) + '</span></div>';
  html += '</div></div>';
  
  // Atomic Structure (置顶，所有数据点共同)
  // Check poscar at material top level (for intermetallic data) or in structure
  let poscarPath = material.poscar || firstStruct.poscar;
  if (poscarPath) {
    // Convert absolute path to relative for GitHub Pages
    const relativePath = poscarPath.startsWith('/') ? poscarPath.substring(1) : poscarPath;
    html += '<div class="detail-section">';
    html += '<h3>' + (currentLang === 'en' ? 'Atomic Structure' : '原子结构') + '</h3>';
    html += '<div class="structure-viewer-container">';
    html += '<div id="viewer-' + material.id + '" class="structure-viewer"></div>';
    html += '<div class="viewer-controls">';
    html += '<button onclick="resetView(\'' + material.id + '\')" class="viewer-btn">' + (currentLang === 'en' ? 'Reset View' : '重置视角') + '</button>';
    html += '<button onclick="toggleStyle(\'' + material.id + '\')" class="viewer-btn">' + (currentLang === 'en' ? 'Toggle Style' : '切换样式') + '</button>';
    html += '<a href="' + relativePath + '" download class="viewer-btn download-btn">' + (currentLang === 'en' ? 'Download POSCAR' : '下载POSCAR') + '</a>';
    
    // Display POSCAR source - user-specified or default to DFT relaxation
    let poscarSourceText = '';
    if (material.poscar_source) {
      // User specified the source
      poscarSourceText = currentLang === 'en' 
        ? '(structure from ' + material.poscar_source + ')'
        : '(结构来自' + material.poscar_source + ')';
    } else {
      // Default: assume DFT relaxation
      poscarSourceText = currentLang === 'en' 
        ? '(structure from DFT relaxation)'
        : '(结构来自DFT弛豫)';
    }
    html += '<span style="color: #888; font-size: 11px; margin-left: 10px;">' + poscarSourceText + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  }
  
  // Group data by property sections
  // Structure Properties (excluding atomic structure)
  html += '<div class="detail-section">';
  html += '<h3>' + t('structureInfo') + '</h3>';
  sortedData.forEach((dataPoint, idx) => {
    const props = dataPoint.properties || {};
    const struct = props.structure || {};
    const hideLatticeParams = shouldHideLatticeParameters(material.type);
    html += '<div class="data-subsection">';
    html += '<h4 class="subsection-header">' + dataPoint.temperature + 'K, ' + normalizeSource(dataPoint.source) + '</h4>';
    html += '<div class="detail-grid">';
    html += '<div class="detail-item"><label>' + t('table.density') + ':</label><span>' + formatValue(struct.density, 3) + ' g/cm³</span></div>';
    if (!hideLatticeParams && struct.latticeParameters) {
      html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Point Group:' : '点群:') + '</label><span>' + (struct.latticeParameters.pointGroup || '-') + '</span></div>';
      if (struct.latticeParameters.a) html += '<div class="detail-item"><label>a:</label><span>' + formatValue(struct.latticeParameters.a, 3) + ' Å</span></div>';
      if (struct.latticeParameters.b) html += '<div class="detail-item"><label>b:</label><span>' + formatValue(struct.latticeParameters.b, 3) + ' Å</span></div>';
      if (struct.latticeParameters.c) html += '<div class="detail-item"><label>c:</label><span>' + formatValue(struct.latticeParameters.c, 3) + ' Å</span></div>';
      if (struct.latticeParameters.alpha) html += '<div class="detail-item"><label>α:</label><span>' + formatValue(struct.latticeParameters.alpha, 1) + '°</span></div>';
      if (struct.latticeParameters.beta) html += '<div class="detail-item"><label>β:</label><span>' + formatValue(struct.latticeParameters.beta, 1) + '°</span></div>';
      if (struct.latticeParameters.gamma) html += '<div class="detail-item"><label>γ:</label><span>' + formatValue(struct.latticeParameters.gamma, 1) + '°</span></div>';
    }
    html += '</div>';
    if (struct.rdf) {
      html += '<div class="chart-container">';
      html += '<h5>' + t('table.rdf') + '</h5>';
      html += renderChart(struct.rdf, 'rdf-' + material.id + '-' + idx, 'RDF');
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  
  // Thermodynamics Properties
  html += '<div class="detail-section">';
  html += '<h3>' + t('thermoInfo') + '</h3>';
  sortedData.forEach((dataPoint, idx) => {
    const props = dataPoint.properties || {};
    const thermo = props.thermodynamics || {};
    const hideMixingEnthalpy = shouldHideMixingEnthalpy(material.type);
    html += '<div class="data-subsection">';
    html += '<h4 class="subsection-header">' + dataPoint.temperature + 'K, ' + normalizeSource(dataPoint.source) + '</h4>';
    html += '<div class="detail-grid">';
    html += '<div class="detail-item"><label>' + t('table.formationEnergy') + ':</label><span>' + formatValue(thermo.formationEnergy, 2) + ' eV</span></div>';
    html += '<div class="detail-item"><label>C_v:</label><span>' + formatValue(thermo.specificHeat_v !== undefined ? thermo.specificHeat_v : thermo.specificHeat, 2) + ' J/kg·K</span></div>';
    html += '<div class="detail-item"><label>C_p:</label><span>' + formatValue(thermo.specificHeat_p !== undefined ? thermo.specificHeat_p : thermo.specificHeat, 2) + ' J/kg·K</span></div>';
    if (!hideMixingEnthalpy) {
      html += '<div class="detail-item"><label>' + t('table.mixingEnthalpy') + ':</label><span>' + formatValue(thermo.mixingEnthalpy, 2) + ' kJ/mol</span></div>';
    }
    html += '<div class="detail-item"><label>' + t('table.diffusionCoeff') + ':</label><span>' + formatScientific(thermo.diffusionCoefficient) + ' m²/s</span></div>';
    html += '<div class="detail-item"><label>' + t('table.thermalExpansion') + ':</label><span>' + formatScientific(thermo.thermalExpansion) + ' 10⁻⁶/K</span></div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  
  // Mechanics Properties
  html += '<div class="detail-section">';
  html += '<h3>' + t('mechInfo') + '</h3>';
  sortedData.forEach((dataPoint, idx) => {
    const props = dataPoint.properties || {};
    const mech = props.mechanics || {};
    const interfaceStressOnly = shouldShowOnlyStressStrain(material.type);
    html += '<div class="data-subsection">';
    html += '<h4 class="subsection-header">' + dataPoint.temperature + 'K, ' + normalizeSource(dataPoint.source) + '</h4>';
    html += '<div class="detail-grid">';
    if (interfaceStressOnly) {
      html += '<div class="detail-item full-width"><label>' + (currentLang === 'en' ? 'Note:' : '说明:') + '</label><span>' + getPropertyNotMeaningfulText() + '</span></div>';
    } else {
      html += '<div class="detail-item"><label>' + t('table.youngsModulus') + ':</label><span>' + formatValue(mech.youngsModulus, 2) + ' GPa</span></div>';
      html += '<div class="detail-item"><label>' + t('table.bulkModulus') + ':</label><span>' + formatValue(mech.bulkModulus, 2) + ' GPa</span></div>';
      html += '<div class="detail-item"><label>' + t('table.shearModulus') + ':</label><span>' + formatValue(mech.shearModulus, 2) + ' GPa</span></div>';
      html += '<div class="detail-item"><label>' + t('table.poissonsRatio') + ':</label><span>' + formatValue(mech.poissonsRatio, 3) + '</span></div>';
    }
    html += '</div>';
    
    // Elastic Constants Matrix
    const elasticMatrix = mech.elasticConstants?.matrix || mech.elasticConstants;
    if (!interfaceStressOnly && elasticMatrix && Array.isArray(elasticMatrix)) {
      html += '<div class="elastic-constants-section">';
      html += '<h5>' + (currentLang === 'en' ? 'Elastic Constants Matrix C' : '弹性常数矩阵 C') + '<sub>ij</sub> (GPa)</h5>';
      html += '<table class="cij-matrix">';
      html += '<thead><tr><th></th>';
      for (let j = 1; j <= 6; j++) {
        html += '<th>C<sub>' + j + '</sub></th>';
      }
      html += '</tr></thead><tbody>';
      for (let i = 0; i < 6; i++) {
        html += '<tr><th>C<sub>' + (i+1) + '</sub></th>';
        for (let j = 0; j < 6; j++) {
          const val = elasticMatrix[i] && elasticMatrix[i][j] !== undefined ? elasticMatrix[i][j] : 0;
          html += '<td>' + formatValue(val, 1) + '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      html += '</div>';
    }
    
    if (mech.stressStrain) {
      html += '<div class="chart-container">';
      html += '<h5>' + t('table.stressStrain') + '</h5>';
      html += renderChart(mech.stressStrain, 'stress-' + material.id + '-' + idx, 'Stress-Strain');
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  
  // Defect Properties
  html += '<div class="detail-section">';
  html += '<h3>' + t('defectInfo') + '</h3>';
  sortedData.forEach((dataPoint, idx) => {
    const props = dataPoint.properties || {};
    const defects = props.defects || {};
    const hideDefectProps = shouldHideDefectProperties(material.type);
    html += '<div class="data-subsection">';
    html += '<h4 class="subsection-header">' + dataPoint.temperature + 'K, ' + normalizeSource(dataPoint.source) + '</h4>';
    html += '<div class="detail-grid">';
    if (hideDefectProps) {
      html += '<div class="detail-item full-width"><label>' + (currentLang === 'en' ? 'Note:' : '说明:') + '</label><span>' + getPropertyNotMeaningfulText() + '</span></div>';
    } else {
      html += '<div class="detail-item"><label>' + t('table.vacancyEnergy') + ':</label><span>' + formatValue(defects.vacancyFormationEnergy, 3) + ' eV</span></div>';
      
      // Interstitial with multiple sites
      if (defects.interstitialFormationEnergy != null) {
        if (typeof defects.interstitialFormationEnergy === 'object' && !Array.isArray(defects.interstitialFormationEnergy)) {
          const entries = Object.entries(defects.interstitialFormationEnergy);
          if (entries.length > 0) {
            html += '<div class="detail-item full-width"><label>' + t('table.interstitialEnergy') + ':</label><div class="sites-list">';
            for (const [site, energy] of entries) {
              html += '<div><strong>' + site + ':</strong> ' + formatValue(energy, 3) + ' eV</div>';
            }
            html += '</div></div>';
          }
        } else {
          html += '<div class="detail-item"><label>' + t('table.interstitialEnergy') + ':</label><span>' + formatValue(defects.interstitialFormationEnergy, 3) + ' eV</span></div>';
        }
      }
      
      // Stacking fault energy with multiple types
      if (defects.stackingFaultEnergy != null) {
        if (typeof defects.stackingFaultEnergy === 'object' && !Array.isArray(defects.stackingFaultEnergy)) {
          const entries = Object.entries(defects.stackingFaultEnergy);
          if (entries.length > 0) {
            html += '<div class="detail-item full-width"><label>' + t('table.stackingFault') + ':</label><div class="sites-list">';
            for (const [type, energy] of entries) {
              html += '<div><strong>' + type + ':</strong> ' + formatValue(energy, 2) + ' mJ/m²</div>';
            }
            html += '</div></div>';
          }
        } else {
          html += '<div class="detail-item"><label>' + t('table.stackingFault') + ':</label><span>' + formatValue(defects.stackingFaultEnergy, 2) + ' mJ/m²</span></div>';
        }
      }
    }
    
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  
  return html;
}

// Generate detail view for specific data point
function generateDetailView(material, dataPoint) {
  const props = dataPoint.properties || {};
  const hideLatticeParams = shouldHideLatticeParameters(material.type);
  const hideMixingEnthalpy = shouldHideMixingEnthalpy(material.type);
  const interfaceStressOnly = shouldShowOnlyStressStrain(material.type);
  const hideDefectProps = shouldHideDefectProperties(material.type);
  let html = '';
  
  // Basic Information
  html += '<div class="detail-section">';
  html += '<h3>' + t('basicInfo') + '</h3>';
  html += '<div class="detail-grid">';
  html += '<div class="detail-item"><label>ID:</label><span>' + material.id + '</span></div>';
  html += '<div class="detail-item"><label>' + t('table.name') + ':</label><span>' + material.name + '</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Material Source:' : '材料来源:') + '</label><span>' + formatSourceLabel(material.source || material.id) + '</span></div>';
  html += '<div class="detail-item"><label>' + t('table.type') + ':</label><span>' + translateType(material.type) + '</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Composition:' : '元素组成:') + '</label><span>' + formatComposition(material.composition) + '</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Temperature:' : '温度:') + '</label><span>' + dataPoint.temperature + ' K</span></div>';
  html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Data Source:' : '数据来源:') + '</label><span>' + formatSourceLabel(dataPoint.source, false) + '</span></div>';
  html += '</div></div>';
  
  // Structure Properties
  const struct = props.structure || {};
  html += '<div class="detail-section">';
  html += '<h3>' + t('structureInfo') + '</h3>';
  
  // POSCAR 3D Viewer - check material.poscar at top level or struct.poscar
  let poscarPath = material.poscar || struct.poscar;
  if (poscarPath) {
    // Convert absolute path to relative for GitHub Pages
    const relativePath = poscarPath.startsWith('/') ? poscarPath.substring(1) : poscarPath;
    html += '<div class="structure-viewer-container">';
    html += '<h4>' + (currentLang === 'en' ? 'Atomic Structure' : '原子结构') + '</h4>';
    html += '<div id="viewer-' + material.id + '" class="structure-viewer"></div>';
    html += '<div class="viewer-controls">';
    html += '<button onclick="resetView(\'' + material.id + '\')" class="viewer-btn">' + (currentLang === 'en' ? 'Reset View' : '重置视角') + '</button>';
    html += '<button onclick="toggleStyle(\'' + material.id + '\')" class="viewer-btn">' + (currentLang === 'en' ? 'Toggle Style' : '切换样式') + '</button>';
    html += '<a href="' + relativePath + '" download class="viewer-btn download-btn">' + (currentLang === 'en' ? 'Download POSCAR' : '下载POSCAR') + '</a>';
    html += '</div>';
    html += '</div>';
  }
  
  html += '<div class="detail-grid">';
  html += '<div class="detail-item"><label>' + t('table.density') + ':</label><span>' + formatValue(struct.density, 3) + ' g/cm³</span></div>';
  if (!hideLatticeParams && struct.latticeParameters) {
    html += '<div class="detail-item"><label>' + (currentLang === 'en' ? 'Point Group:' : '点群:') + '</label><span>' + (struct.latticeParameters.pointGroup || '-') + '</span></div>';
    if (struct.latticeParameters.a) html += '<div class="detail-item"><label>a:</label><span>' + formatValue(struct.latticeParameters.a, 3) + ' Å</span></div>';
    if (struct.latticeParameters.b) html += '<div class="detail-item"><label>b:</label><span>' + formatValue(struct.latticeParameters.b, 3) + ' Å</span></div>';
    if (struct.latticeParameters.c) html += '<div class="detail-item"><label>c:</label><span>' + formatValue(struct.latticeParameters.c, 3) + ' Å</span></div>';
    if (struct.latticeParameters.alpha) html += '<div class="detail-item"><label>α:</label><span>' + formatValue(struct.latticeParameters.alpha, 1) + '°</span></div>';
    if (struct.latticeParameters.beta) html += '<div class="detail-item"><label>β:</label><span>' + formatValue(struct.latticeParameters.beta, 1) + '°</span></div>';
    if (struct.latticeParameters.gamma) html += '<div class="detail-item"><label>γ:</label><span>' + formatValue(struct.latticeParameters.gamma, 1) + '°</span></div>';
  }
  html += '</div>';
  if (struct.rdf) {
    html += '<div class="chart-container">';
    html += '<h4>' + t('table.rdf') + '</h4>';
    html += renderChart(struct.rdf, 'rdf-' + material.id, 'RDF');
    html += '</div>';
  }
  html += '</div>';
  
  // Thermodynamics Properties
  const thermo = props.thermodynamics || {};
  html += '<div class="detail-section">';
  html += '<h3>' + t('thermoInfo') + '</h3>';
  html += '<div class="detail-grid">';
  html += '<div class="detail-item"><label>C_v:</label><span>' + formatValue(thermo.specificHeat_v !== undefined ? thermo.specificHeat_v : thermo.specificHeat, 2) + ' J/kg·K</span></div>';
  html += '<div class="detail-item"><label>C_p:</label><span>' + formatValue(thermo.specificHeat_p !== undefined ? thermo.specificHeat_p : thermo.specificHeat, 2) + ' J/kg·K</span></div>';
  if (!hideMixingEnthalpy) {
    html += '<div class="detail-item"><label>' + t('table.mixingEnthalpy') + ':</label><span>' + formatValue(thermo.mixingEnthalpy, 2) + ' kJ/mol</span></div>';
  }
  html += '<div class="detail-item"><label>' + t('table.diffusionCoeff') + ':</label><span>' + formatScientific(thermo.diffusionCoefficient) + ' m²/s</span></div>';
  html += '<div class="detail-item"><label>' + t('table.thermalExpansion') + ':</label><span>' + formatScientific(thermo.thermalExpansion) + ' 10⁻⁶/K</span></div>';
  html += '</div></div>';
  
  // Mechanics Properties
  const mech = props.mechanics || {};
  html += '<div class="detail-section">';
  html += '<h3>' + t('mechInfo') + '</h3>';
  html += '<div class="detail-grid">';
  if (interfaceStressOnly) {
    html += '<div class="detail-item full-width"><label>' + (currentLang === 'en' ? 'Note:' : '说明:') + '</label><span>' + getPropertyNotMeaningfulText() + '</span></div>';
  } else {
    html += '<div class="detail-item"><label>' + t('table.youngsModulus') + ':</label><span>' + formatValue(mech.youngsModulus, 2) + ' GPa</span></div>';
    html += '<div class="detail-item"><label>' + t('table.bulkModulus') + ':</label><span>' + formatValue(mech.bulkModulus, 2) + ' GPa</span></div>';
    html += '<div class="detail-item"><label>' + t('table.shearModulus') + ':</label><span>' + formatValue(mech.shearModulus, 2) + ' GPa</span></div>';
    html += '<div class="detail-item"><label>' + t('table.poissonsRatio') + ':</label><span>' + formatValue(mech.poissonsRatio, 3) + '</span></div>';
  }
  html += '</div>';
  
  // Elastic Constants Matrix - support both array and object format
  const elasticMatrix = mech.elasticConstants?.matrix || mech.elasticConstants;
  if (!interfaceStressOnly && elasticMatrix && Array.isArray(elasticMatrix)) {
    html += '<div class="elastic-constants-section">';
    html += '<h4>' + (currentLang === 'en' ? 'Elastic Constants Matrix C' : '弹性常数矩阵 C') + '<sub>ij</sub> (GPa)</h4>';
    html += '<table class="cij-matrix">';
    html += '<thead><tr><th></th>';
    for (let j = 1; j <= 6; j++) {
      html += '<th>C<sub>' + j + '</sub></th>';
    }
    html += '</tr></thead><tbody>';
    for (let i = 0; i < 6; i++) {
      html += '<tr><th>C<sub>' + (i+1) + '</sub></th>';
      for (let j = 0; j < 6; j++) {
        const val = elasticMatrix[i] && elasticMatrix[i][j] !== undefined ? elasticMatrix[i][j] : 0;
        html += '<td>' + formatValue(val, 1) + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    html += '</div>';
  }
  
  if (mech.stressStrain) {
    html += '<div class="chart-container">';
    html += '<h4>' + t('table.stressStrain') + '</h4>';
    html += renderChart(mech.stressStrain, 'stress-' + material.id, 'Stress-Strain');
    html += '</div>';
  }
  html += '</div>';
  
  // Defect Properties
  const defects = props.defects || {};
  html += '<div class="detail-section">';
  html += '<h3>' + t('defectInfo') + '</h3>';
  html += '<div class="detail-grid">';
  if (hideDefectProps) {
    html += '<div class="detail-item full-width"><label>' + (currentLang === 'en' ? 'Note:' : '说明:') + '</label><span>' + getPropertyNotMeaningfulText() + '</span></div>';
  } else {
    html += '<div class="detail-item"><label>' + t('table.vacancyEnergy') + ':</label><span>' + formatValue(defects.vacancyFormationEnergy, 3) + ' eV</span></div>';
    
    // Interstitial with multiple sites
    if (defects.interstitialFormationEnergy != null) {
      if (typeof defects.interstitialFormationEnergy === 'object' && !Array.isArray(defects.interstitialFormationEnergy)) {
        const entries = Object.entries(defects.interstitialFormationEnergy);
        if (entries.length > 0) {
          html += '<div class="detail-item full-width"><label>' + t('table.interstitialEnergy') + ':</label><div class="sites-list">';
          for (const [site, energy] of entries) {
            html += '<div><strong>' + site + ':</strong> ' + formatValue(energy, 3) + ' eV</div>';
          }
          html += '</div></div>';
        }
      } else {
        html += '<div class="detail-item"><label>' + t('table.interstitialEnergy') + ':</label><span>' + formatValue(defects.interstitialFormationEnergy, 3) + ' eV</span></div>';
      }
    }
    
    // Stacking fault energy with multiple types
    if (defects.stackingFaultEnergy != null) {
      if (typeof defects.stackingFaultEnergy === 'object' && !Array.isArray(defects.stackingFaultEnergy)) {
        const entries = Object.entries(defects.stackingFaultEnergy);
        if (entries.length > 0) {
          html += '<div class="detail-item full-width"><label>' + t('table.stackingFault') + ':</label><div class="sites-list">';
          for (const [type, energy] of entries) {
            html += '<div><strong>' + type + ':</strong> ' + formatValue(energy, 2) + ' mJ/m²</div>';
          }
          html += '</div></div>';
        }
      } else {
        html += '<div class="detail-item"><label>' + t('table.stackingFault') + ':</label><span>' + formatValue(defects.stackingFaultEnergy, 2) + ' mJ/m²</span></div>';
      }
    }
  }
  
  html += '</div></div>';
  
  return html;
}

// Update detail view when user changes data source
window.updateDetailView = function(materialId, dataIndex) {
  const material = allData.find(m => m.id == materialId);
  if (!material || !material.data[dataIndex]) return;
  
  const dataPoint = material.data[dataIndex];
  const viewDiv = document.getElementById('detailDataView');
  if (viewDiv) {
    viewDiv.innerHTML = generateDetailView(material, dataPoint);
    setTimeout(() => hydrateCharts(viewDiv), 0);
    // Re-initialize 3D viewer if POSCAR exists - check material.poscar or struct.poscar
    const struct = dataPoint.properties?.structure;
    const poscarPath = material.poscar || struct?.poscar;
    if (poscarPath) {
      setTimeout(() => init3DViewer(materialId, poscarPath), 100);
    }
  }
};

// Initialize 3D molecular viewer
let viewerInstances = {};
let viewerStyles = {}; // Track current style for each viewer

function init3DViewer(materialId, poscarUrl) {
  console.log('Initializing 3D viewer:', { materialId, poscarUrl });
  
  // Convert absolute path to relative path for GitHub Pages
  // Remove leading slash to make it relative to current page
  if (poscarUrl.startsWith('/')) {
    poscarUrl = poscarUrl.substring(1);
    console.log('Converted to relative path:', poscarUrl);
  }
  
  const viewerId = 'viewer-' + materialId;
  const element = document.getElementById(viewerId);
  if (!element) {
    console.error('Viewer element not found:', viewerId);
    return;
  }
  
  // Clean up existing viewer
  if (viewerInstances[materialId]) {
    element.innerHTML = '';
  }
  
  // Create viewer
  const config = { backgroundColor: 'white' };
  const viewer = $3Dmol.createViewer(element, config);
  viewerInstances[materialId] = viewer;
  viewerStyles[materialId] = 'sphere'; // Default style
  
  console.log('Fetching POSCAR from:', poscarUrl);
  // Load POSCAR file
  fetch(poscarUrl)
    .then(response => {
      console.log('POSCAR fetch response:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
      }
      return response.text();
    })
    .then(poscarData => {
      console.log('POSCAR data loaded, length:', poscarData.length);
      viewer.addModel(poscarData, 'vasp');
      viewer.setStyle({}, { sphere: { radius: 0.5 }, stick: { radius: 0.15 } });
      viewer.zoomTo();
      viewer.render();
      console.log('3D viewer rendered successfully');
    })
    .catch(error => {
      console.error('Error loading POSCAR:', error);
      element.innerHTML = '<p class="error-message">' + 
        (currentLang === 'en' ? 'Failed to load structure file: ' : '无法加载结构文件：') + 
        error.message + '</p>';
    });
}

// Reset viewer camera
window.resetView = function(materialId) {
  const viewer = viewerInstances[materialId];
  if (viewer) {
    viewer.zoomTo();
    viewer.render();
  }
};

// Toggle visualization style
window.toggleStyle = function(materialId) {
  const viewer = viewerInstances[materialId];
  if (!viewer) return;
  
  const currentStyle = viewerStyles[materialId] || 'sphere';
  let newStyle;
  
  if (currentStyle === 'sphere') {
    // Ball and stick
    viewer.setStyle({}, { sphere: { radius: 0.5 }, stick: { radius: 0.15 } });
    newStyle = 'ball-stick';
  } else if (currentStyle === 'ball-stick') {
    // Stick only
    viewer.setStyle({}, { stick: { radius: 0.2 } });
    newStyle = 'stick';
  } else if (currentStyle === 'stick') {
    // Lines
    viewer.setStyle({}, { line: {} });
    newStyle = 'line';
  } else {
    // Back to sphere
    viewer.setStyle({}, { sphere: { radius: 0.5 }, stick: { radius: 0.15 } });
    newStyle = 'sphere';
  }
  
  viewerStyles[materialId] = newStyle;
  viewer.render();
};

window.__chartQueue = window.__chartQueue || {};

function queueChartSpec(id, spec) {
  window.__chartQueue[id] = spec;
  return '<canvas id="' + id + '" class="chart-canvas" data-chart-id="' + id + '"></canvas>';
}

function hydrateCharts(container) {
  const root = container || document;
  const canvases = root.querySelectorAll('canvas[data-chart-id]');
  canvases.forEach((canvas) => {
    if (canvas.dataset.chartHydrated === '1') return;
    const chartId = canvas.dataset.chartId;
    const spec = window.__chartQueue[chartId];
    if (!spec) return;
    canvas.dataset.chartHydrated = '1';
    if (spec.kind === 'array') {
      window.renderPlot(chartId, spec.data, spec.title);
    } else if (spec.kind === 'file') {
      window.renderPlotFromFile(chartId, spec.path, spec.title);
    }
  });
}

// Render chart (image or plot)
function renderChart(data, id, title) {
  if (!data || data === '-') {
    return '<p class="no-data">' + t('noDataAvailable') + '</p>';
  }

  // Object can be stress-strain mappings like {"100": "path/to/file.dat"}
  if (typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== '-');
    if (entries.length === 0) {
      return '<p class="no-data">' + t('noDataAvailable') + '</p>';
    }

    // Support object form with x/y arrays
    if ('x' in data && 'y' in data && Array.isArray(data.x) && Array.isArray(data.y)) {
      const points = data.x.map((x, i) => ({ x: Number(x), y: Number(data.y[i]) })).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
      return queueChartSpec(id, { kind: 'array', data: points, title });
    }

    let html = '<div class="multi-chart">';
    entries.forEach(([label, value], i) => {
      const subId = id + '-' + i;
      html += '<div class="chart-subitem">';
      html += '<div style="font-size:12px;color:#555;margin-bottom:6px;">' + label + '</div>';
      if (typeof value === 'string' && /\.(txt|dat|csv)(\?|$)/i.test(value)) {
        html += queueChartSpec(subId, { kind: 'file', path: value, title: title + ' - ' + label });
      } else if (Array.isArray(value)) {
        html += queueChartSpec(subId, { kind: 'array', data: value, title: title + ' - ' + label });
      } else {
        html += '<p class="no-data">' + t('noDataAvailable') + '</p>';
      }
      html += '</div>';
    });
    html += '</div>';
    return html;
  }
  
  // If data is a URL/path (string)
  if (typeof data === 'string') {
    // Parse text-like RDF/stress-strain files into curves
    if (/\.(txt|dat|csv)(\?|$)/i.test(data)) {
      return queueChartSpec(id, { kind: 'file', path: data, title });
    }
    return '<img src="' + data + '" alt="' + title + '" class="chart-image" />';
  }
  
  // If data is an array, create a simple plot
  if (Array.isArray(data)) {
    return queueChartSpec(id, { kind: 'array', data, title });
  }
  
  return '<p>' + t('noDataAvailable') + '</p>';
}

function parseTextSeries(content) {
  const points = [];
  const lines = String(content || '').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const cols = line.split(/[\s,]+/).filter(Boolean);
    if (cols.length < 2) continue;
    const x = Number(cols[0]);
    const y = Number(cols[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      points.push({ x, y });
    }
  }
  return points;
}

window.renderPlotFromFile = function(canvasId, filePath, title) {
  fetch(filePath)
    .then((resp) => {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.text();
    })
    .then((text) => {
      const points = parseTextSeries(text);
      if (!points.length) {
        const canvas = document.getElementById(canvasId);
        if (canvas && canvas.parentElement) {
          canvas.parentElement.innerHTML = '<p class="no-data">' + t('noDataAvailable') + ' (parse failed)</p>';
        }
        return;
      }
      window.renderPlot(canvasId, points, title);
    })
    .catch((err) => {
      console.error('Failed to render file chart:', filePath, err);
      const canvas = document.getElementById(canvasId);
      if (canvas && canvas.parentElement) {
        canvas.parentElement.innerHTML = '<p class="no-data">' + t('noDataAvailable') + ' (load failed)</p>';
      }
    });
};

// Simple plot rendering using Canvas
window.renderPlot = function(canvasId, data, title) {
  setTimeout(function() {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('Canvas not found:', canvasId);
      return;
    }
    console.log('Rendering chart:', canvasId, 'data points:', data.length);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Simple line plot
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const points = data
      .map((d, i) => {
        if (typeof d === 'number') return { x: i, y: d };
        if (Array.isArray(d)) return { x: Number(d[0]), y: Number(d[1]) };
        if (typeof d === 'object') {
          const x = Number((d.x !== undefined) ? d.x : i);
          const y = Number((d.y !== undefined) ? d.y : d[1]);
          return { x, y };
        }
        return { x: i, y: Number(d) };
      })
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

    if (points.length < 2) {
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(t('noDataAvailable'), width / 2, height / 2);
      return;
    }

    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const xRange = xMax - xMin || 1;
    const yMin = Math.min(...points.map(p => p.y));
    const yMax = Math.max(...points.map(p => p.y));
    const yRange = yMax - yMin || 1;

    points.forEach((point, i) => {
      const x = padding + ((point.x - xMin) / xRange) * plotWidth;
      const plotY = height - padding - ((point.y - yMin) / yRange) * plotHeight;
      
      if (i === 0) {
        ctx.moveTo(x, plotY);
      } else {
        ctx.lineTo(x, plotY);
      }
    });
    
    ctx.stroke();
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 20);
  }, 100);
};

// Export functionality
let currentFilteredData = [];
let selectedMaterials = new Set();

function openExportDialog() {
  const modal = document.getElementById('exportModal');
  currentFilteredData = getCurrentFilteredData();
  
  // Update filtered count
  const filteredCountEl = document.getElementById('filteredCount');
  if (filteredCountEl) {
    filteredCountEl.textContent = `(${currentFilteredData.length} materials)`;
  }
  
  // Show/hide material selector based on selection
  document.querySelectorAll('input[name="exportRange"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const selector = document.getElementById('materialSelector');
      if (this.value === 'selected') {
        selector.classList.remove('hidden');
        populateMaterialSelector();
      } else {
        selector.classList.add('hidden');
      }
    });
  });
  
  modal.style.display = 'block';
}

function getCurrentFilteredData() {
  const searchTerm = document.getElementById('q').value.toLowerCase();
  let filtered = allData;
  
  if (currentType !== 'all') {
    filtered = filtered.filter(item => item.type === currentType);
  }
  
  if (searchTerm) {
    filtered = filtered.filter(item => {
      const matchesName = item.name.toLowerCase().includes(searchTerm);
      const matchesElement = matchesElementFilter(item, searchTerm);
      return matchesName || matchesElement;
    });
  }
  
  return applyTypeDisplayOrder(filtered);
}

function populateMaterialSelector() {
  const listEl = document.getElementById('selectorList');
  listEl.innerHTML = '';
  
  allData.forEach(material => {
    const item = document.createElement('label');
    item.className = 'selector-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = material.id;
    checkbox.onchange = function() {
      if (this.checked) {
        selectedMaterials.add(material.id);
      } else {
        selectedMaterials.delete(material.id);
      }
    };
    
    item.appendChild(checkbox);
    item.appendChild(document.createTextNode(' ' + material.id + ' - ' + material.name));
    listEl.appendChild(item);
  });
  
  // Search functionality
  document.getElementById('selectorSearch').oninput = function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.selector-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
  };
}

function exportData() {
  const format = document.querySelector('input[name="exportFormat"]:checked').value;
  const range = document.querySelector('input[name="exportRange"]:checked').value;
  
  // Get data to export
  let dataToExport = [];
  if (range === 'all') {
    dataToExport = allData;
  } else if (range === 'filtered') {
    dataToExport = currentFilteredData;
  } else if (range === 'selected') {
    dataToExport = allData.filter(m => selectedMaterials.has(m.id));
  }
  
  if (dataToExport.length === 0) {
    alert(t('export.noDataToExport'));
    return;
  }
  
  // Get selected properties
  const includeStructure = document.getElementById('propStructure').checked;
  const includeThermodynamics = document.getElementById('propThermodynamics').checked;
  const includeMechanics = document.getElementById('propMechanics').checked;
  const includeDefects = document.getElementById('propDefects').checked;
  
  // Filter properties in each data point
  const filteredDataExport = dataToExport.map(material => {
    const newMaterial = {
      id: material.id,
      name: material.name,
      type: material.type,
      composition: material.composition,
      data: material.data.map(dp => {
        const newDp = {
          temperature: dp.temperature,
          source: dp.source,
          properties: {}
        };
        
        if (includeStructure && dp.properties.structure) {
          newDp.properties.structure = dp.properties.structure;
        }
        if (includeThermodynamics && dp.properties.thermodynamics) {
          newDp.properties.thermodynamics = dp.properties.thermodynamics;
        }
        if (includeMechanics && dp.properties.mechanics) {
          newDp.properties.mechanics = dp.properties.mechanics;
        }
        if (includeDefects && dp.properties.defects) {
          newDp.properties.defects = dp.properties.defects;
        }
        
        return newDp;
      })
    };
    return newMaterial;
  });
  
  // Export based on format
  if (format === 'json') {
    exportJSON(filteredDataExport);
  } else if (format === 'csv') {
    exportCSV(filteredDataExport);
  }
  
  // Close modal
  document.getElementById('exportModal').style.display = 'none';
}

function exportJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alloy_materials_' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download all POSCAR files as ZIP
async function downloadAllPOSCAR() {
  const range = document.querySelector('input[name="exportRange"]:checked').value;
  
  // Get materials to export
  let materialsToExport = [];
  if (range === 'all') {
    materialsToExport = allData;
  } else if (range === 'filtered') {
    materialsToExport = currentFilteredData;
  } else if (range === 'selected') {
    materialsToExport = allData.filter(m => selectedMaterials.has(m.id));
  }
  
  // Collect all POSCAR files
  const poscarFiles = [];
  materialsToExport.forEach(material => {
    material.data.forEach(dataPoint => {
      const struct = dataPoint.properties?.structure;
      if (struct && struct.poscar) {
        poscarFiles.push({
          url: struct.poscar,
          filename: `${material.id}_${material.name.replace(/[^a-zA-Z0-9]/g, '_')}_${dataPoint.temperature}K_${dataPoint.source}.vasp`
        });
      }
    });
  });
  
  if (poscarFiles.length === 0) {
    alert(currentLang === 'en' ? 
      'No POSCAR files found in selected materials' : 
      '所选材料中未找到POSCAR文件');
    return;
  }
  
  // Check if JSZip is available
  if (typeof JSZip === 'undefined') {
    alert(currentLang === 'en' ? 
      'JSZip library not loaded. Please refresh the page.' : 
      'JSZip库未加载，请刷新页面');
    return;
  }
  
  // Create ZIP file
  const zip = new JSZip();
  const poscarFolder = zip.folder('poscar');
  
  // Show progress
  const progressMsg = currentLang === 'en' ? 
    `Downloading ${poscarFiles.length} POSCAR files...` : 
    `正在下载 ${poscarFiles.length} 个POSCAR文件...`;
  
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.textContent = progressMsg;
    loadingEl.style.display = 'block';
  }
  
  try {
    // Download all files
    const downloadPromises = poscarFiles.map(async file => {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
        const content = await response.text();
        poscarFolder.file(file.filename, content);
        return true;
      } catch (error) {
        console.error(`Error downloading ${file.url}:`, error);
        return false;
      }
    });
    
    await Promise.all(downloadPromises);
    
    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Download ZIP file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poscar_files_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (loadingEl) {
      loadingEl.textContent = currentLang === 'en' ? 
        'Download complete!' : '下载完成！';
      setTimeout(() => {
        loadingEl.style.display = 'none';
        loadingEl.textContent = 'Loading...';
      }, 2000);
    }
    
    // Close modal
    document.getElementById('exportModal').style.display = 'none';
    
  } catch (error) {
    console.error('Error creating ZIP:', error);
    alert(currentLang === 'en' ? 
      'Failed to create ZIP file' : 
      '创建ZIP文件失败');
    
    if (loadingEl) {
      loadingEl.style.display = 'none';
      loadingEl.textContent = 'Loading...';
    }
  }
}

function exportCSV(data) {
  // Flatten V2 data to CSV format (primary data only)
  const rows = [];
  const headers = [
    'ID', 'Name', 'Type', 'Composition',
    'Temperature', 'Source',
    'Density', 'PointGroup', 'a', 'b', 'c', 'alpha', 'beta', 'gamma',
    'SpecificHeat', 'MixingEnthalpy', 'DiffusionCoeff', 'ThermalExpansion',
    'YoungsModulus', 'PoissonsRatio',
    'VacancyEnergy', 'InterstitialEnergy', 'StackingFaultEnergy'
  ];
  rows.push(headers.join(','));
  
  data.forEach(material => {
    material.data.forEach(dp => {
      const row = [];
      row.push(material.id);
      row.push('"' + material.name + '"');
      row.push(material.type);
      row.push('"' + material.composition + '"');
      row.push(dp.temperature);
      row.push(dp.source);
      
      const props = dp.properties || {};
      const struct = props.structure || {};
      const thermo = props.thermodynamics || {};
      const mech = props.mechanics || {};
      const defects = props.defects || {};
      
      row.push(struct.density || '');
      row.push(struct.latticeParameters?.pointGroup || '');
      row.push(struct.latticeParameters?.a || '');
      row.push(struct.latticeParameters?.b || '');
      row.push(struct.latticeParameters?.c || '');
      row.push(struct.latticeParameters?.alpha || '');
      row.push(struct.latticeParameters?.beta || '');
      row.push(struct.latticeParameters?.gamma || '');
      row.push(thermo.specificHeat || '');
      row.push(thermo.mixingEnthalpy || '');
      row.push(typeof thermo.diffusionCoefficient === 'object' ? 
        JSON.stringify(thermo.diffusionCoefficient) : 
        (thermo.diffusionCoefficient || ''));
      row.push(typeof thermo.thermalExpansion === 'object' ? 
        JSON.stringify(thermo.thermalExpansion) : 
        (thermo.thermalExpansion || ''));
      row.push(mech.youngsModulus || '');
      row.push(mech.poissonsRatio || '');
      row.push(defects.vacancyFormationEnergy || '');
      row.push(typeof defects.interstitialFormationEnergy === 'object' ? 
        JSON.stringify(defects.interstitialFormationEnergy) : 
        (defects.interstitialFormationEnergy || ''));
      row.push(typeof defects.stackingFaultEnergy === 'object' ? 
        JSON.stringify(defects.stackingFaultEnergy) : 
        (defects.stackingFaultEnergy || ''));
      
      rows.push(row.join(','));
    });
  });
  
  const csvStr = rows.join('\n');
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alloy_materials_' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Modal close handlers
document.getElementById('modalClose').onclick = function() {
  document.getElementById('detailModal').style.display = 'none';
};

document.getElementById('exportModalClose').onclick = function() {
  document.getElementById('exportModal').style.display = 'none';
};

document.getElementById('executeExport').onclick = function() {
  exportData();
};

document.getElementById('cancelExport').onclick = function() {
  document.getElementById('exportModal').style.display = 'none';
};

window.onclick = function(event) {
  const detailModal = document.getElementById('detailModal');
  const exportModal = document.getElementById('exportModal');
  if (event.target === detailModal) {
    detailModal.style.display = 'none';
  }
  if (event.target === exportModal) {
    exportModal.style.display = 'none';
  }
};