let ids = []
onEvent('entity.spawned', event => {
	console.log(event.entity.type)
	if (event.entity.type == 'tconstruct:terracube') {
		ids.push(event.entity.id)
		event.server.scheduleInTicks(1, event => {
			let id = ids.pop()
			event.server.runCommand(`attribute ${id} forge:entity_gravity base set 0.015`)
			event.server.runCommand(`attribute ${id} minecraft:generic.movement_speed base set 0.8`)
			event.server.runCommand(`attribute ${id} minecraft:generic.knockback_resistance base set 0.9`)
		})
	}
})