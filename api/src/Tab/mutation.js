const { extendType, stringArg, booleanArg } = require('@nexus/schema');
const { AuthenticationError } = require('apollo-server-express');
const { verifyToken } = require('../utils/tokens');
const { decodeId } = require('../utils/hashIds');

const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createTab', {
            type: 'Tab',
            args: {
                tab: stringArg(),
            },
            resolve: async (parent, args, context) => {
                const { valid, userId } = verifyToken(context);
                if (valid) {
                    const user = await context.prisma.user.findOne({
                        where: { id: userId },
                    });
                    return context.prisma.tab.create({
                        data: {
                            tab: args.tab,
                            user: { connect: { id: user.id } },
                        },
                    });
                }
                return context.prisma.tab.create({
                    data: {
                        tab: args.tab,
                    },
                });
            },
        });

        t.field('saveTab', {
            type: 'Tab',
            args: {
                hashId: stringArg(),
                title: stringArg(),
                author: stringArg(),
                tune: stringArg(),
                tab: stringArg(),
                private: booleanArg(),
            },
            resolve: async (parent, args, context) => {
                const tabId = decodeId(args.hashId);
                const { valid, userId } = verifyToken(context);

                function saveData() {
                    return context.prisma.tab.update({
                        where: { id: tabId },
                        data: {
                            title: args.title,
                            author: args.author,
                            tune: args.tune,
                            tab: args.tab,
                            private: args.private,
                        },
                    });
                }

                function checkTabOwner(tab, tabHasUserAssigned) {
                    const isCorrectOwner = userId === tab.userId;
                    if (tabHasUserAssigned && !isCorrectOwner) {
                        throw new Error('Tab not found');
                    }
                    return saveData();
                }

                function checkIfTabHasOwner(tab) {
                    const tabHasUserAssigned = tab.userId !== null;
                    if (tabHasUserAssigned && !valid) {
                        throw new AuthenticationError('You must be logged in');
                    }
                    return checkTabOwner(tab, tabHasUserAssigned);
                }

                async function getTab() {
                    const tab = await context.prisma.tab.findOne({
                        where: { id: tabId },
                    });
                    if (!tab) {
                        throw new Error('Tab not found');
                    }
                    return checkIfTabHasOwner(tab);
                }

                return getTab();
            },
        });

        t.list.field('assignTabs', {
            type: 'Tab',
            args: {
                tabsIds: stringArg(),
            },
            resolve: async (parent, args, context) => {
                const { valid, userId } = verifyToken(context);

                function returnTabs(decodedIdsList) {
                    return context.prisma.tab.findMany({
                        where: {
                            id: {
                                in: decodedIdsList,
                            },
                        },
                    });
                }

                async function assign(decodedIdsList) {
                    const promises = decodedIdsList.map((tabId) => (
                        context.prisma.tab.update({
                            where: { id: tabId },
                            data: {
                                user: {
                                    connect: { id: userId },
                                },
                            },
                        })
                    ));
                    await Promise.all(promises);
                    return returnTabs(decodedIdsList);
                }

                function decodeTabsIds(tabsIdsList) {
                    const decodedIdsList = tabsIdsList.map(decodeId);
                    return assign(decodedIdsList);
                }

                function getTabsIds() {
                    const tabsIds = args.tabsIds || '';
                    const tabsIdsList = tabsIds.split(',');
                    return decodeTabsIds(tabsIdsList);
                }

                function checkValidToken() {
                    if (!valid) {
                        throw new AuthenticationError('You must be logged in');
                    }
                    return getTabsIds();
                }

                return checkValidToken();
            },
        });
    },
});

module.exports = UserMutation;
