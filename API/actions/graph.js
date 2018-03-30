const db = require('../models');

/**
 * Get all graphs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getGraphs = async function(req, res) {
    const model = await db.Model.findOne({ where: { name: req.query.model } });
    const graphs = await model.getGraphs();
    res.json(graphs);
};

/**
 * Get measurements from a given graph
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getMeasurements = async function(req, res) {
    const graph = await db.Graph.findOne({ where: { name: req.query.graph } });
    const measurements = await graph.getGraphSteps({
        include: [{association: db.GraphStep.Measurements}]
    });
    res.json(measurements);
};

/**
 * Add a new graph step
 * @param req
 * @param res
 * @param io
 * @returns {Promise<void>}
 */
exports.addGraphStep = async function(req, res, io) {
    try {
        console.log(req.query);
        const model = await db.Model.findOne({ where: { name: req.query.model } });
        if (model) {
            let graph = await
                model.getGraphs({ where: { name: req.query.graph } });
            if (graph.length === 0) {
                graph = await
                    db.Graph.create({ name: req.query.graph, model_id: model.id });
            } else graph = graph[0];
            let name = req.query.name;
            if (!req.query.name) {
                const date = new Date();
                name = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            }
            const graphStep = await db.GraphStep.create({
                name,
                graph_id: graph.id
            });

            io.sockets.to('clients').emit('newGraphStep', {
                Measurements: [],
                graph_id: graph.id,
                id: graphStep.id,
                name: graphStep.name
            });
            res.sendStatus(200);
        }else {
            res.sendStatus(400);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
};

/**
 * Add a new measurement
 * @param req
 * @param res
 * @param io
 * @returns {Promise<void>}
 */
exports.addMeasurement = async function(req, res, io) {
    try {
        const model = await db.Model.findOne({ where: { name: req.query.model } });
        if (model) {
            let graph = await model.getGraphs({ where: { name: req.query.graph } });
            if (graph.length === 0) {
                graph = await db.Graph.create({ name: req.query.graph, model_id: model.id });
            } else graph = graph[0];
            let graphStep = null;
            if(req.query.step) {
                graphStep = await db.GraphStep.findOne({
                    where: {
                        graph_id: graph.id,
                        name: req.query.step
                    }
                });
            }else {
                graphStep = await db.GraphStep.findOne({
                    where: {
                        graph_id: graph.id
                    },
                    order: [['id', 'DESC']]
                });
                if(!graphStep) {
                    const date = new Date();
                    const name = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    graphStep = await db.GraphStep.create({
                        name,
                        graph_id: graph.id
                    });
                }
            }
            if(graphStep) {
                const measure = await db.Measurement.create({
                    value: req.body.value,
                    label: req.body.label,
                    graph_step_id: graphStep.id
                });
                io.sockets.to('clients').emit('newMeasurement', {
                    graph_step_id: graphStep.id,
                    graph_step: graphStep,
                    value: measure.value,
                    label: measure.label,
                    createdAt: measure.createdAt,
                    id: measure.id
                });
                res.sendStatus(200);
            } else res.sendStatus(400);
        }else {
            res.sendStatus(400);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
};
