"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CoreModuleSchema = new mongoose_1.Schema({
    name: String,
    icon: String, // lucide icon name
    title: String,
    description: String,
    telemetry: [{ key: String, value: String, description: String }]
});
var InstallationStepSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    desc: String,
    cmd: String
});
var InstallationTabSchema = new mongoose_1.Schema({
    tabName: String,
    steps: [InstallationStepSchema],
    svgIcon: String
});
var KeyTakeawaySchema = new mongoose_1.Schema({
    title: String,
    content: String
});
var AttackPathSchema = new mongoose_1.Schema({
    title: String,
    risk: String,
    desc: String
});
var ScenarioSchema = new mongoose_1.Schema({
    name: String,
    objective: String,
    objectiveList: [String],
    script: String,
    logsImage: String,
    keyTakeaways: [KeyTakeawaySchema],
    attackPaths: [AttackPathSchema]
});
var TroubleshootingSchema = new mongoose_1.Schema({
    problem: String,
    cause: String,
    resolution: String,
    command: String
});
var ReferenceSchema = new mongoose_1.Schema({
    name: String,
    type: String,
    url: String,
    updatedAt: String
});
var SystemSupportSchema = new mongoose_1.Schema({
    os: String,
    icon: String,
    sub: String
});
var SpecItemSchema = new mongoose_1.Schema({
    k: String,
    v: String
});
var ToolSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    developer: { type: String },
    tier: { type: String, default: "Expert" },
    bestFor: { type: String, default: "Red Teaming" },
    overview: { type: String },
    core_modules: [CoreModuleSchema],
    installation_sequence: [InstallationTabSchema],
    scenarios: [ScenarioSchema],
    troubleshooting: [TroubleshootingSchema],
    references_list: [ReferenceSchema],
    security: { type: String },
    system_support: [SystemSupportSchema],
    minimum_spec: [SpecItemSchema],
    optimized_spec: [SpecItemSchema]
});
exports.default = mongoose_1.default.models.Tool || mongoose_1.default.model("Tool", ToolSchema);
