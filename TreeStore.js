/* 
    Можно было бы заменить forEach на for т.к. for быстрее. Но это редко когда оправданно
*/

/** @typedef {{ id: (String | number), parent: (String | number) }} Node */

/**
 * @class Дерево объектов { id, parent }
 */
export default class TreeStore {
    /** @type {Array<Node>} - исходный массив */
    #sourceArray;
    /** @type {Map<(String | number), Array<Node>>} - Map детей (ключ - id родителя) */
    #parentsChildren;
    /** @type {Map<(String | number), Node>} - Map узлов (ключ - id узла) */
    #nodes;

    /**
     * @param {Array<Node>} items исходный массив
     */
    constructor(items) {
        this.#sourceArray = items;
        this.#parentsChildren = new Map();
        this.#nodes = new Map();
        this.#init();
    }

    /**
     * Инициализация дерева
     */
    #init() {
        this.#sourceArray.forEach((node) => {
            this.#nodes.set(node.id, node);

            if (this.#parentsChildren.has(node.parent))
                this.#parentsChildren.get(node.parent).push(node);
            else
                this.#parentsChildren.set(node.parent, [node]);
        });
    }

    /**
     * Получить исходный массив
     * @returns {Array<Node>} исходный массив
     */
    getAll() {
        return this.#sourceArray;
    }

    /**
     * Получить узел с переданным id
     * @param {(Number | String)} id id узла
     * @returns {(Node | undefined)} узел
     */
    getItem(id) {
        return this.#nodes.get(id);
    }

    /**
     * Получить всех прямых потомков узла
     * @param {(Number | String)} id id узла
     * @returns {Array<Node>} - массив потомков
     */
    getChildren(id) {
        return this.#parentsChildren.get(id) ?? [];
    }

    /**
     * Получить всех потомков узла
     * @param {(Number | String)} id id узла
     * @returns {Array<Node>} - массив потомков
     */
    getAllChildren(id) {
        const result = [];
        const queue = [...(this.#parentsChildren.get(id) ?? [])];
        let node = queue.pop();
        while(node) {
            result.push(node);
            queue.push(...(this.#parentsChildren.get(node.id) ?? []));
            node = queue.pop();
        }
        return result;
    }

    /**
     * Получить всех родителей от узла до корня дерева
     * @param {(Number | String)} id id узла
     * @returns {Array<Node>} - массив родителей
     */
    getAllParents(id) {
        const result = [];
        if (!this.#nodes.has(id)) return result;

        let node = this.#nodes.get(this.#nodes.get(id).parent);
        // Я бы не защищался от node.id === node.parent, но так точно не зациклимся
        while(node && node.id !== node.parent) {
            result.push(node);
            node = this.#nodes.get(node.parent);
        }
        return result;
    }
}