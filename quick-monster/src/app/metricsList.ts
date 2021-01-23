import { MonsterStatBase } from './metrics'

export const MONSTER_BASES = new Map();
// TODO use map instead of object

export const METRICS = {
    "0": new MonsterStatBase(12, 3, 2, 1, 9, 1),
    "1/8": new MonsterStatBase(12, 9, 3, 3, 10, 2),
    "1/4": new MonsterStatBase(13, 15, 3, 5, 10, 2),
    "1/2": new MonsterStatBase(13, 24, 4, 8, 11, 3),
    "1": new MonsterStatBase(13, 30, 4, 10, 11, 3),
    "2": new MonsterStatBase(13, 45, 5, 15, 12, 4),
    "3": new MonsterStatBase(14, 60, 5, 20, 12, 4),
    "4": new MonsterStatBase(14, 75, 6, 25, 13, 5),
    "5": new MonsterStatBase(14, 90, 6, 30, 13, 5),
    "6": new MonsterStatBase(15, 105, 7, 35, 14, 6),
    "7": new MonsterStatBase(15, 120, 7, 40, 14, 6),
    "8": new MonsterStatBase(15, 120, 8, 40, 15, 7),
    "9": new MonsterStatBase(16, 135, 8, 45, 15, 7),
    "10": new MonsterStatBase(16, 150, 9, 50, 16, 8),
    "11": new MonsterStatBase(16, 165, 9, 55, 16, 8),
    "12": new MonsterStatBase(17, 180, 10, 60, 17, 9),
    "13": new MonsterStatBase(17, 195, 10, 65, 17, 9),
    "14": new MonsterStatBase(17, 210, 11, 70, 18, 10),
    "15": new MonsterStatBase(18, 225, 11, 75, 18, 10),
    "16": new MonsterStatBase(18, 240, 12, 80, 19, 11),
    "17": new MonsterStatBase(18, 255, 12, 85, 19, 11),
    "18": new MonsterStatBase(19, 270, 13, 90, 20, 12),
    "19": new MonsterStatBase(19, 285, 13, 95, 20, 12),
    "20": new MonsterStatBase(19, 300, 14, 100, 21, 13),
    "21": new MonsterStatBase(20, 315, 14, 105, 21, 13),
    "22": new MonsterStatBase(20, 330, 15, 110, 22, 14),
    "23": new MonsterStatBase(20, 345, 15, 115, 22, 14),
    "24": new MonsterStatBase(21, 360, 16, 120, 23, 15),
    "25": new MonsterStatBase(21, 375, 16, 125, 23, 15),
    "26": new MonsterStatBase(21, 390, 17, 130, 24, 16),
    "27": new MonsterStatBase(22, 405, 17, 135, 24, 16),
    "28": new MonsterStatBase(22, 420, 18, 140, 25, 17),
    "29": new MonsterStatBase(23, 435, 18, 145, 25, 17),
    "30": new MonsterStatBase(23, 440, 19, 150, 26, 18)
};