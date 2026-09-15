import fs from "fs/promises";
import path from "path";

const dbPath = path.join(import.meta.dirname, "data.json");

export function createDB() {
  return {
    async getById(resource, id) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource].find((x) => String(x.id) === String(id));
    },

    async getAll(resource) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      return json[resource];
    },

    async create(resource, obj) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);

      const newObj = { ...obj, id: getId() };

      const newResource = [...json[resource], newObj];

      const newData = {
        ...json,
        [resource]: newResource,
      };
      await fs.writeFile(dbPath, JSON.stringify(newData));
      
      return newObj;
    },

    async update(resource, id, updates) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      const newResource = json[resource].map((x) => {
        if (x.id != id) {
          return x;
        } else {
          return {
            ...x,
            ...updates,
            id: x.id,
          };
        }
      });

      const newData = {
        ...json,
        [resource]: newResource,
      };
      await fs.writeFile(dbPath, JSON.stringify(newData));
    },

    async delete(resource, id) {
      const data = await fs.readFile(dbPath, { encoding: "utf-8" });
      const json = JSON.parse(data);
      const newResource = json[resource].filter((x) => x.id != id);

      const newData = {
        ...json,
        [resource]: newResource,
      };

      await fs.writeFile(dbPath, JSON.stringify(newData));
    },
  };
}

function getId() {
  return String(Math.floor(Math.random() * 10000000));
}
