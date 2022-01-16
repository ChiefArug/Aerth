const datagen = {
	ores: [
		{
			name: 'diamond', 
			mod: 'minecraft',
			type: 'gem',
			slime_affinity: 'sky',
			tier: 2
		},
		{
			name: 'ruby', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'blood',
			tier: 2
		},
		{
			name: 'emerald', 
			mod: 'minecraft',
			type: 'gem',
			slime_affinity: 'earth',
			tier: 2
		},
		{
			name: 'sapphire', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'ender',
			tier: 2
		},
		{
			name: 'apatite', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'ender',
			tier: 1
		},
		{
			name: 'cinnabar', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'blood',
			tier: 1
		},
		{
			name: 'quartz', 
			mod: 'appliedenergistics2',
			type: 'gem',
			slime_affinity: 'clay',
			tier: 1
		},
		{
			name: 'sulfur', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'earth',
			tier: 1
		},
		{
			name: 'niter', 
			mod: 'thermal',
			type: 'gem',
			slime_affinity: 'clay',
			tier: 2
		},
		{
			name: 'lapis', 
			mod: 'minecraft',
			type: 'gem',
			slime_affinity: 'sky',
			tier: 1
		},
		{
			name: 'gold',
			mod: 'minecraft',
			type: 'metal',
			tier: 2
		},
		{
			name: 'copper',
			mod: 'thermal',
			type: 'metal',
			tier: 1
		},
		{
			name: 'lead',
			mod: 'thermal',
			type: 'metal',
			tier: 2
		},
		{
			name: 'nickel',
			mod: 'thermal',
			type: 'metal',
			tier: 3
		},
		{
			name: 'tin',
			mod: 'thermal',
			type: 'metal',
			tier: 1
		},
		{
			name: 'silver',
			mod: 'thermal',
			type: 'metal',
			tier: 3
		},
	],
	tiers: {
		metal: {
			1: {
				range_max: 128,
				range_min: 30,
				cluster_size: 10,
				per_chunk: 40 	
			},
			2: {
				range_max: 45,
				range_min: 15,
				cluster_size: 8,
				per_chunk: 15
			},
			3: {
				range_max: 30,
				range_min: 0,
				cluster_size: 4,
				per_chunk: 15
			}
		},
		gem: {
			1: {
				range_max: 25,
				range_min: 5,
				cluster_size: 2,
				per_chunk: 20
			},
			2: {
				range_max: 20,
				range_min: 0,
				cluster_size: 8,
				per_chunk: 10
			}
		}
	}
}
const biomes = {
	'forest/blood_slimelands': 'blood',
	'forest/earth_slimelands': 'earth',
	'forest/ender_slimelands': 'ender',
	'forest/sky_slimelands': 'sky'
}
const currentVersion = 12
onEvent('loaded', event => {
	let loadedBefore = JsonIO.read('kubejs/datagen_state.json')
	console.log('Datagen version: ' + loadedBefore.version)
	if (loadedBefore && !(loadedBefore.version < currentVersion)) return
	console.log('Datagen is go!')
	for (o of datagen.ores) {
		let tier = datagen.tiers[o.type][o.tier]
		let oreData = {
			type: 'minecraft:ore',
			config: {
				state: {Name: `${o.mod}:${o.name}_ore`},
				target: {
					predicate_type: 'minecraft:tag_match',
					tag: 'aerth:ore_replaceable'
				},
				size: tier.cluster_size
			}
		}
		JsonIO.write(`kubejs/data/aerth/worldgen/configured_feature/ores/${o.name}.json`, oreData)
		let placementData = {
			type: 'minecraft:decorated',
			config: {
				decorator: {
					type: 'minecraft:count',config: {count: tier.per_chunk}
				},
				feature: {
					type: 'minecraft:decorated',
					config: {
						decorator: {type: 'minecraft:square',config: {}},
						feature: {type: 'minecraft:decorated',
							config: {
								decorator: {
									type: 'minecraft:depth_average',
									config: {
										baseline: ((tier.range_max - tier.range_min) / 2) + tier.range_min,
										spread: (tier.range_max - tier.range_min) / 2
									}
								},
								feature: `aerth:ores/${o.name}`
							}
						}
					}
				}
			}
		}
		JsonIO.write(`kubejs/data/aerth/worldgen/configured_feature/ores/${o.name}_placed.json`, placementData)
		/*for (b in biomes) {
			if (o.slime_affinity === biomes[b] || o.type === 'metal'){
				let biome = JsonIO.read(`kubejs/data/aerth/worldgen/biome/${b}.json`)
				biome.features[6].push(`aerth:ores/${o.name}_placed`)
				JsonIO.write(`kubejs/data/aerth/worldgen/biome/${b}.json`, biome)
			}
		}*/
	}
	JsonIO.write('kubejs/datagen_state.json', {version: currentVersion})
})