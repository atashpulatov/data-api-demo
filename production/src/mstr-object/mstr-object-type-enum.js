class _MstrObjectType {
  // TODO: Add support for documents

  mstrObjectType = {
    folder: {
      type: 8,
      subtypes: [2048],
      name: "folder",
      request: "folders"
    },
    report: {
      type: 3,
      subtypes: [768, 769, 774],
      name: "report",
      request: "reports"
    },
    dataset: {
      type: 3,
      subtypes: [776, 779],
      name: "dataset",
      request: "cubes"
    },
    dossier: {
      type: 55,
      subtypes: [14081],
      name: "dossier",
      request: "dossiers"
    },
    visualization: {
      // TODO: Change string to proper type and subtype of visualization
      type: "undefined",
      subtypes: "undefined",
      name: "visualization",
      request: "visualizations"
    }
  };

  getMstrTypeBySubtype = objectSubtype => {
    for (let key in this.mstrObjectType) {
      if (this.mstrObjectType[key].subtypes.indexOf(objectSubtype) !== -1) {
        return this.mstrObjectType[key];
      }
    }
    console.error("Object type is not currently supported by mstr Add-In");
  };

  getMstrTypeByName = typeName => {
    for (let key in this.mstrObjectType) {
      if (this.mstrObjectType[key].name === typeName.name.toLowerCase()) {
        return this.mstrObjectType[key];
      }
    }
    console.error("Object type is not currently supported by mstr Add-In");
  };
}

export const MstrObjectType = new _MstrObjectType();
