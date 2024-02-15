import { describe, test, expect, beforeAll } from 'vitest';
import TreeStore from './TreeStore.js';

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

let ts = null;
beforeAll(() => {
    ts = new TreeStore(items);
});

// Ключи могут быть строками поэтому a.id - b.id не подходит
const sortComparator = (a, b) => String(a.id).localeCompare(String(b.id));

describe('TreeStore', () => {
    test('getAll', () => {
        expect(ts.getAll()).toBe(items);
    });

    test('getItem', () => {
        expect(ts.getItem(items[3].id)).toBe(items[3]);
    });

    test('getChildren', () => {
        const gch4 = [
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ];
        expect(ts.getChildren(4).sort(sortComparator)).toStrictEqual(
            gch4.sort(sortComparator)
        );

        const gch5 = [];
        expect(ts.getChildren(5).sort(sortComparator)).toStrictEqual(
            gch5.sort(sortComparator)
        );

        const gch2 = [
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
        ];
        expect(ts.getChildren(2).sort(sortComparator)).toStrictEqual(
            gch2.sort(sortComparator)
        );
    });

    test('getAllChildren', () => {
        const gach2 = [
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ];
        expect(ts.getAllChildren(2).sort(sortComparator)).toStrictEqual(
            gach2.sort(sortComparator)
        );
    });

    test('getAllParents', () => {
        const gap7 = [
            { id: 4, parent: 2, type: 'test' },
            { id: 2, parent: 1, type: 'test' },
            { id: 1, parent: 'root' },
        ];
        expect(ts.getAllParents(7).sort(sortComparator)).toStrictEqual(
            gap7.sort(sortComparator)
        );
    });
});
