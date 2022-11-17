var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
var router = express.Router();
var prisma = new PrismaClient({});
// Add New Vote
router.post("/option/:optionId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var io, signedInUser, decodedToken, token, option, vote_1, vote, error_1, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                io = req.app.get("socket.io");
                signedInUser = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                token = req.cookies.userToken;
                if (token) {
                    decodedToken = jwt.verify(token, process.env.SECRET);
                    if (decodedToken) {
                        signedInUser = decodedToken.userId;
                    }
                }
                return [4 /*yield*/, prisma.pollOption.findFirst({
                        where: {
                            id: req.params.optionId,
                        },
                        include: {
                            question: true,
                        },
                    })];
            case 2:
                option = _a.sent();
                if (!option)
                    throw new Error("Choice not found.");
                if (!(option === null || option === void 0 ? void 0 : option.question.secure)) return [3 /*break*/, 4];
                if (!signedInUser)
                    throw new Error("You need to be signed in to vote.");
                if (option.question.signedInVoters.includes(signedInUser))
                    throw new Error("You have already voted in this poll.");
                return [4 /*yield*/, prisma.pollOption.update({
                        where: {
                            id: req.params.optionId,
                        },
                        data: {
                            vote: option.vote + 1,
                            question: {
                                update: {
                                    totalVotes: option.question.totalVotes + 1,
                                    signedInVoters: {
                                        push: signedInUser,
                                    },
                                },
                            },
                        },
                        include: {
                            question: {
                                include: {
                                    options: true,
                                },
                            },
                        },
                    })];
            case 3:
                vote_1 = _a.sent();
                io.emit(req.body.pollId + "poll", {
                    updatedPost: vote_1.question,
                });
                res.status(200).json({ data: vote_1 });
                return [2 /*return*/];
            case 4: return [4 /*yield*/, prisma.pollOption.update({
                    where: {
                        id: req.params.optionId,
                    },
                    data: {
                        vote: option.vote + 1,
                        question: {
                            update: {
                                totalVotes: option.question.totalVotes + 1,
                            },
                        },
                    },
                    include: {
                        question: {
                            include: {
                                options: true,
                            },
                        },
                    },
                })];
            case 5:
                vote = _a.sent();
                io.emit(req.body.pollId + "poll", {
                    updatedPost: vote.question,
                });
                res.status(200).json({ data: vote });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                err = error_1;
                res.status(400).json({ error: err.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
export default router;
