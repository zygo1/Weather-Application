export const icon_map = new Map();
addMapping([0, 1], 'day');
addMapping([2], 'cloudy-day');
addMapping([3, 45, 48], 'cloudy');
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'rainy');
addMapping([71, 73, 75, 77, 85, 86], 'snowy');
addMapping([95, 96, 99], 'thunder');

function addMapping(values, icon) {
    values.forEach(value => {
        icon_map.set(value, icon)
    });
}