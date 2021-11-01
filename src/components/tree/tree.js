import React, { Component } from "react";
import TreeNode from "../tree-node";
import AddButton from "../add-button";
import ControlPanel from "../control-panel";
import TextView from "../text-view";
import "./tree.css";
import axios from "axios";

function updateQuestions(tree) {
    axios.post("https://serene-brook-03900.herokuapp.com/updatequestiontree", tree[0])
        .then(
            res => {
            })
}

class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: this.initializedСopy(this.props.data),
            savedNodes: [],
            removedNodes: []
        }
        this.changeTitle = this.changeTitle.bind(this);
        this.addRootElement = this.addRootElement.bind(this);
        this.addChild = this.addChild.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.nodesToString = this.nodesToString.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data.length === 0) {
            this.setState({
                nodes: this.initializedСopy(this.props.data),
                savedNodes: [],
            })
            this.changeTitle = this.changeTitle.bind(this);
            this.addRootElement = this.addRootElement.bind(this);
            this.addChild = this.addChild.bind(this);
            this.removeNode = this.removeNode.bind(this);
            this.saveState = this.saveState.bind(this);
            this.loadState = this.loadState.bind(this);
            this.onTextChange = this.onTextChange.bind(this);
            this.nodesToString = this.nodesToString.bind(this);
        }
    }

    initializedСopy(nodes, location) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title, id, type, page_id } = nodes[i];
            const hasChildren = children !== undefined;
            const node_id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = {
                children: hasChildren ? this.initializedСopy(children, node_id) : undefined,
                changeTitle: this.changeTitle(node_id),
                removeNode: this.removeNode(node_id),
                addChild: this.addChild(node_id),
                id,
                title,
                type,
                page_id
            };
        }
        return nodesCopy;
    }

    changeTitle(id) {
        return (newTitle) => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];
            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;
            this.setState({ nodes });
        };
    }

    addRootElement() {
        const node_id = this.state.nodes.length ? `${this.state.nodes.length + 1}` : "1";
        const newNode = {
            children: undefined,
            changeTitle: this.changeTitle(node_id),
            removeNode: this.removeNode(node_id),
            addChild: this.addChild(node_id),
            node_id,
            id: undefined,
            type: "Q",
            title: "",
        };

        const nodes = [...this.state.nodes, newNode];
        this.setState({ nodes });
    }

    addChild(id) {
        return () => {
            var node_id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (node_id.length > 1) {
                for (let i = 1; i < node_id.length; i++) {
                    changingNode = changingNode.children[node_id[i] - 1];
                }
            }

            if (changingNode.children === undefined) {
                changingNode.children = [];
            }

            node_id = `${node_id.join(".")}.${changingNode.children.length + 1}`;
            var type = "Q"
            if (changingNode.type === "Q") {
                type = "A"
            }
            changingNode.children = [
                ...changingNode.children,
                {
                    children: undefined,
                    changeTitle: this.changeTitle(node_id),
                    removeNode: this.removeNode(node_id),
                    addChild: this.addChild(node_id),
                    node_id,
                    type,
                    page_id: changingNode.page_id,
                    title: "",
                }];

            this.setState({ nodes });
        }
    }

    removeNode(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];
            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0])
                ];

                this.setState({ nodes: this.initializedСopy(newNodes) });

            } else {

                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                }

                this.setState({
                    removedNodes: this.state.removedNodes
                        .concat([{
                            "id": changingNode.children[id[id.length - 1] - 1].id,
                            "type": changingNode.children[id[id.length - 1] - 1].type
                        }])
                })
                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                changingNode.children = newChildren;

                this.setState({ nodes: this.initializedСopy(nodes) });
            }
        }
    }

    saveState() {
        this.setState({ savedNodes: this.initializedСopy(this.state.nodes) });
        let to_be_saved_nodes = this.state.nodes 
        to_be_saved_nodes[0].removedNodes = this.state.removedNodes
        updateQuestions(to_be_saved_nodes);
        this.setState({removedNodes: []})
    }

    loadState() {
        this.setState({ nodes: this.initializedСopy(this.state.savedNodes) });
    }

    onTextChange(e) {
        this.setState({ nodes: this.initializedСopy(JSON.parse(e.target.value)) });
    }

    nodesToString() {
        return JSON.stringify(this.simplify(this.state.nodes), undefined, 2);
    }

    simplify(nodes) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = {
                title,
                children: hasChildren ? this.simplify(children) : undefined,
            };
        }
        return nodesCopy;
    }

    render() {
        const { nodes, savedNodes } = this.state;
        const { addRootElement, saveState,
            loadState, onTextChange, nodesToString } = this;
        const hasSaved = savedNodes.length !== 0;

        return (
            <div className="Tree">

                <div className="Tree-LeftSide">
                    <ControlPanel {...{ hasSaved, saveState, loadState }} />
                    <ul className="Nodes">
                        {nodes.map((nodeProps) => {
                            const { id, ...others } = nodeProps;
                            return (
                                <TreeNode
                                    key={id}
                                    {...others}
                                />
                            );
                        })}
                    </ul>
                    <AddButton onClick={addRootElement} />
                </div>

                <div className="Tree-RightSide">
                    <TextView
                        value={nodesToString()}
                        onChange={onTextChange}
                    />
                </div>
            </div>
        );
    }
}

export default Tree;