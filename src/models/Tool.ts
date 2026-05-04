import mongoose, { Schema, Document } from "mongoose";

const CoreModuleSchema = new Schema({
    name: String,
    icon: String, // lucide icon name
    title: String,
    description: String,
    telemetry: [{ key: String, value: String, description: String }]
});

export interface IInstallationStep {
    id: string;
    name: string;
    desc: string;
    cmd: string;
}

const InstallationStepSchema = new Schema({
    id: String,
    name: String,
    desc: String,
    cmd: String
});

export interface IInstallationTab {
    tabName: string;
    steps: IInstallationStep[];
    svgIcon?: string;
}

const InstallationTabSchema = new Schema({
    tabName: String,
    steps: [InstallationStepSchema],
    svgIcon: String
});

export interface IKeyTakeaway {
    title: string;
    content: string;
}

const KeyTakeawaySchema = new Schema({
    title: String,
    content: String
});

export interface IAttackPath {
    title: string;
    risk: string;
    desc: string;
}

const AttackPathSchema = new Schema({
    title: String,
    risk: String,
    desc: String
});

export interface IScenario {
    name: string;
    objective: string;
    objectiveList: string[];
    script: string;
    logsImage: string;
    keyTakeaways: IKeyTakeaway[];
    attackPaths: IAttackPath[];
}

const ScenarioSchema = new Schema({
    name: String,
    objective: String,
    objectiveList: [String],
    script: String,
    logsImage: String,
    keyTakeaways: [KeyTakeawaySchema],
    attackPaths: [AttackPathSchema]
});

export interface ITroubleshooting {
    problem: string;
    cause: string;
    resolution: string;
    command?: string;
}

const TroubleshootingSchema = new Schema({
    problem: String,
    cause: String,
    resolution: String,
    command: String
});

export interface IReference {
    name: string;
    type: string;
    url: string;
    updatedAt: string;
}

const ReferenceSchema = new Schema({
    name: String,
    type: String,
    url: String,
    updatedAt: String
});

const ToolSchema: Schema = new Schema({
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
    security: { type: String }
});

export default mongoose.models.Tool || mongoose.model("Tool", ToolSchema);
