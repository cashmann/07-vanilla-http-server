'use strict';

const debug = require('debug')('storage/fs');

import { tmpdir } from 'os';
import fs from 'fs';
import uuid from 'uuid/v4';

const readFilePromise = promisify(fs.readFile);
const readdirPromise = promisify(fs.readdir);
const writeFilePromise = promisify(fs.writeFile);

export default class FilesystemStorage {
  constructor(schema) {
    this.schema = schema;
    this.path = `${tmpdir}/${this.schema}`;
    debug({ path: this.path });
    try {
      fs.mkdirSync(this.path);
    } catch (err) {
      if (err.code !== 'EEXIST')
        throw err;
    }
  }

  save(document) {
    if (typeof document !== 'object') {
      return Promise.reject(new Error(
        `Failed to save non-object in schema "${this.schema}"`
      ));
    }

    let toSave = {
      id: uuid(),
      ...document,
    };
    let path = `${this.path}/${toSave.id}.json`;
    return writeFilePromise(
      path,
      JSON.stringify(toSave)
    ).then(() => {
      return toSave;
    });
  }

  get(id) {
    let path = `${this.path}/${id}.json`;
    return readFilePromise(path)
      .then(data => {
        return JSON.parse(data);
      })
      .catch(err => {
        if (err.code === 'ENOENT')
          return Promise.reject(new Error(
            `Document with id "${id}" in schema "${this.schema}" not found`
          ));

        return Promise.reject(err);
      });
  }

  getAll() {
    return readdirPromise(this.path)
      .then(files => {
        debug({ files });
        return Promise.all(
          files.map(file => this.get(file.substring(0, file.length-5)))
        );
      })
      .catch(err => {
        console.error(err);
        return [];
      });
  }
}

function promisify (asyncFunction) {
  return (...args) =>
    new Promise((resolve, reject) => {
      asyncFunction(...args, (err, result) => {
        if (err) { reject(err); }
        else { resolve(result); }
      });
    });
}