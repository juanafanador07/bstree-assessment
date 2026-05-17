import { describe, expect, it } from "vitest";

import {
  createNode,
  insert,
  search,
  inOrder,
  preOrder,
  postOrder,
  getHeight,
} from "./bst";

describe("bst placeholders", () => {
  it("insert should place smaller values on the left", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);

    expect(root.left?.value).toBe(5);
  });

  it("insert should place larger values on the right", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 15);

    expect(root.left?.value).toBe(5);
    expect(root.right?.value).toBe(15);
  });

  it("search should return null for non-existent values using strict equality", () => {
    const root = {
      value: 10,
      left: createNode(5),
      right: createNode(15),
    };

    expect(search(root, "5")).toBeNull();
  });
});

describe("BST Edge Cases", () => {
  it("insert: should return the exact same node reference when inserting a duplicate value", () => {
    const root = createNode(10);
    const result = insert(root, 10);
    expect(result).toBe(root);
  });

  it("search: should return null when searching in an empty tree (null root)", () => {
    expect(search(null, 5)).toBeNull();
  });
});

describe("inOrder traversal", () => {
  it("should return an empty array for an empty tree (null)", () => {
    expect(inOrder(null)).toEqual([]);
  });

  it("should return values in order (left -> root -> right)", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 15);
    root = insert(root, 3);
    root = insert(root, 7);

    expect(inOrder(root)).toEqual([3, 5, 7, 10, 15]);
  });
});

describe("preOrder traversal", () => {
  it("should return an empty array for an empty tree (null)", () => {
    expect(preOrder(null)).toEqual([]);
  });

  it("should return values in pre-order (root -> left -> right)", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 15);
    root = insert(root, 3);
    root = insert(root, 7);

    expect(preOrder(root)).toEqual([10, 5, 3, 7, 15]);
  });
});

describe("postOrder traversal", () => {
  it("should return an empty array for an empty tree (null)", () => {
    expect(postOrder(null)).toEqual([]);
  });

  it("should return values in post-order (left -> right -> root)", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 15);
    root = insert(root, 3);
    root = insert(root, 7);

    expect(postOrder(root)).toEqual([3, 7, 5, 15, 10]);
  });
});

describe("getHeight", () => {
  it("should return 0 for an empty tree (null)", () => {
    expect(getHeight(null)).toBe(0);
  });

  it("should return 1 for a single-node tree", () => {
    const root = createNode(10);
    expect(getHeight(root)).toBe(1);
  });

  it("should return correct height for a balanced tree", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 15);
    expect(getHeight(root)).toBe(2);
  });

  it("should return correct height for an unbalanced tree path", () => {
    let root = null;
    root = insert(root, 10);
    root = insert(root, 5);
    root = insert(root, 3);
    root = insert(root, 1);
    expect(getHeight(root)).toBe(4);
  });
});
