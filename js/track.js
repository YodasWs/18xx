game18xx.trackTiles = [
	{trackLevel: 1, track:[['n','m']]},
	{trackLevel: 1, track:[['h','m']]},
	{trackLevel: 1, track:[['u','m']]},
	{trackLevel: 1, track:[['u'],['m']], stations:['']},
	{trackLevel: 1, track:[['h'],['m']], stations:['']},
	{trackLevel: 2, track:[['u','m'],['h','k']]},
	{trackLevel: 2, track:[['u','n'],['h','m']]},
	{trackLevel: 2, track:[['u','m'],['n','k']]},
//	{trackLevel: 2, track:[['u','n'],['i','m']]},
//	{trackLevel: 2, track:[['n','m'],['n','u']]},
//	{trackLevel: 2, track:[['h','m'],['h','u']]},
//	{trackLevel: 2, track:[['u','m'],['u','i']]},
	{trackLevel: 2, track:[['u','m'],['h','m']]},
	{trackLevel: 2, track:[['u','m'],['i','m']]},
	{trackLevel: 2, track:[['u'],['m'],['i'],['k']], stations:['']},
	{trackLevel: 2, track:[['u'],['m'],['i'],['n']], stations:['']},
	{trackLevel: 2, track:[['u'],['m'],['i'],['h']], stations:['']},
	{trackLevel: 2, track:[['u'],['k'],['n']], stations:[''], trackCode:'B'},
	{trackLevel: 3, track:[['u','m'],['m','i'],['u','i']]},
	{trackLevel: 3, track:[['u','m'],['m','i'],['u','k']]},
];

game18xx.tileColor = [
	'transparent',
	'yellow',
	'green',
	'tomato',
	'transparent',
	'grey'
];

// Defaults for Tile Sprites
window.onReady(function() {
Object.extend(game18xx.defaults, {
	tile:{trackLevel:0}
});
});
