# 云端数据库具体性质项对照表（中文版）

- 数据源：_site/data/materials.json
- 生成时间：2026-04-03T03:28:57.066Z

说明：`√` 表示该材料类别下的数据结构中存在该性质项。

## 结构性质

| 英文字段 | 中文名称 | 非晶 | 合金-固溶体 | 合金-金属间化合物 | 单质 |
|---|---|---:|---:|---:|---:|
| density | 密度 | √ | √ | √ | √ |
| latticeParameters | 晶格参数 |  | √ | √ | √ |
| latticeParameters.a | 晶格常数a |  | √ | √ | √ |
| latticeParameters.alpha | 晶格角α |  | √ | √ | √ |
| latticeParameters.b | 晶格常数b |  | √ | √ | √ |
| latticeParameters.beta | 晶格角β |  | √ | √ | √ |
| latticeParameters.c | 晶格常数c |  | √ | √ | √ |
| latticeParameters.gamma | 晶格角γ |  | √ | √ | √ |
| latticeParameters.pointGroup | 点群 |  | √ | √ | √ |
| rdf | 径向分布函数(RDF) | √ | √ | √ | √ |

## 热力学性质

| 英文字段 | 中文名称 | 非晶 | 合金-固溶体 | 合金-金属间化合物 | 单质 |
|---|---|---:|---:|---:|---:|
| cohesiveEnergy | 内聚能 |  |  |  | √ |
| diffusionCoefficient | 扩散系数 | √ | √ | √ | √ |
| mixingEnthalpy | 混合焓 | √ | √ | √ |  |
| specificHeat | 比热容 | √ | √ | √ |  |
| specificHeat_p | 定压比热(Cp) | √ | √ | √ | √ |
| specificHeat_v | 定容比热(Cv) | √ | √ | √ | √ |
| thermalExpansion | 热膨胀系数 | √ | √ | √ | √ |

## 力学性质

| 英文字段 | 中文名称 | 非晶 | 合金-固溶体 | 合金-金属间化合物 | 单质 |
|---|---|---:|---:|---:|---:|
| bulkModulus | 体积模量 |  | √ | √ | √ |
| elasticConstants | 弹性常数矩阵 |  | √ | √ | √ |
| poissonsRatio | 泊松比 |  | √ | √ | √ |
| shearModulus | 剪切模量 |  | √ | √ | √ |
| stressStrain | 应力-应变数据 |  | √ | √ | √ |
| stressStrain.0001 | 应力-应变(0001方向) |  |  |  | √ |
| stressStrain.001 | 应力-应变(001方向) |  |  |  | √ |
| stressStrain.100 | 应力-应变(100方向) |  |  |  | √ |
| youngsModulus | 杨氏模量 |  | √ | √ | √ |

## 缺陷性质

| 英文字段 | 中文名称 | 非晶 | 合金-固溶体 | 合金-金属间化合物 | 单质 |
|---|---|---:|---:|---:|---:|
| interstitialFormationEnergy | 间隙原子形成能 |  | √ | √ | √ |
| interstitialFormationEnergy.basal_crowdion | 间隙形成能-基面拥挤子 |  |  |  | √ |
| interstitialFormationEnergy.basal_octahedral | 间隙形成能-基面八面体位 |  |  |  | √ |
| interstitialFormationEnergy.basal_split | 间隙形成能-基面分裂位 |  |  |  | √ |
| interstitialFormationEnergy.basal_tetrahedral | 间隙形成能-基面四面体位 |  |  |  | √ |
| interstitialFormationEnergy.crowdion | 间隙形成能-拥挤子 |  |  |  | √ |
| interstitialFormationEnergy.crowdion111 | interstitialFormationEnergy.crowdion111 |  | √ | √ |  |
| interstitialFormationEnergy.crowdion_110 | 间隙形成能-拥挤子(110) |  |  |  | √ |
| interstitialFormationEnergy.crowdion_111 | 间隙形成能-拥挤子(111) |  |  |  | √ |
| interstitialFormationEnergy.dumbbell100 | 间隙形成能-哑铃位100 |  | √ | √ |  |
| interstitialFormationEnergy.dumbbell111 | 间隙形成能-哑铃位111 |  | √ | √ |  |
| interstitialFormationEnergy.dumbbell_100 | 间隙形成能-哑铃位(100) |  |  |  | √ |
| interstitialFormationEnergy.dumbbell_110 | 间隙形成能-哑铃位(110) |  |  |  | √ |
| interstitialFormationEnergy.dumbbell_111 | 间隙形成能-哑铃位(111) |  |  |  | √ |
| interstitialFormationEnergy.octahedral | 间隙形成能-八面体位 |  |  |  | √ |
| interstitialFormationEnergy.split_dumbbell | 间隙形成能-分裂哑铃位 |  |  |  | √ |
| interstitialFormationEnergy.tetrahedral | 间隙形成能-四面体位 |  |  |  | √ |
| stackingFaultEnergy | 层错能 |  | √ | √ | √ |
| stackingFaultEnergy.100_110_usf | 层错能(100_110_usf) |  |  |  | √ |
| stackingFaultEnergy.111_110_usf | 层错能(111_110_usf) |  |  |  | √ |
| stackingFaultEnergy.111_112_isf | 层错能(111_112_isf) |  |  |  | √ |
| stackingFaultEnergy.111_112_usf | 层错能(111_112_usf) |  |  |  | √ |
| vacancyFormationEnergy | 空位形成能 |  | √ | √ | √ |

