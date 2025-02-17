import { Stage, Match, MatchGame, Participant, GroupType, FinalType } from 'brackets-model';
import { CallbackFunction, FormConfiguration } from './form';
import { InMemoryDatabase } from 'brackets-memory-db';
import { BracketsViewer } from './main';
import { BracketsManager } from 'brackets-manager';
import { ToI18nKey, Translator } from './lang';

declare global {
    interface Window {
        bracketsViewer: BracketsViewer,
        inMemoryDatabase: InMemoryDatabase,
        bracketsManager: BracketsManager,
        stageFormCreator: (configuration: FormConfiguration, submitCallable: CallbackFunction) => void,
    }
}

/**
 * The data to display with `brackets-viewer.js`
 */
export interface ViewerData {
    /** The stages to display. */
    stages: Stage[],

    /** The matches of the stage to display. */
    matches: Match[],

    /** The games of the matches to display. */
    matchGames: MatchGame[],

    /** The participants who play in the stage to display. */
    participants: Participant[],
}

/**
 * The possible placements of a participant's origin.
 */
export type Placement = 'none' | 'before' | 'after';

/**
 * The possible sides of a participant.
 */
export type Side = 'opponent1' | 'opponent2';

/**
 * An optional config to provide to `brackets-viewer.js`
 */
export interface Config {
    /**
     * A callback to be called when a match is clicked.
     */
    onMatchClick?: MatchClickCallback;

    /**
     * A function to deeply customize the names of the rounds.
     * If you just want to **translate some words**, please use `addLocale()` instead.
     */
    customRoundName?: (...args: Parameters<RoundNameGetter>) => ReturnType<RoundNameGetter> | undefined,

    /**
     * An optional selector to select the root element.
     */
    selector?: HTMLElement,

    /**
     * Where the position of a participant is placed relative to its name.
     * - If `none`, the position is not added.
     * - If `before`, the position is prepended before the participant name. "#1 Team"
     * - If `after`, the position is appended after the participant name, in parentheses. "Team (#1)"
     */
    participantOriginPlacement?: Placement,

    /**
     * Whether to show the child count of a BoX match separately in the match label.
     * - If `false`, the match label and the child count are in the same place. (Example: "M1.1, Bo3")
     * - If `true`, the match label and the child count are in an opposite place. (Example: "M1.1   (right-->) Bo3")
     */
    separatedChildCountLabel?: boolean,

    /**
     * Whether to show the origin of a slot (wherever possible).
     */
    showSlotsOrigin?: boolean,

    /**
     * Whether to show the origin of a slot (in the lower bracket of an elimination stage).
     */
    showLowerBracketSlotsOrigin?: boolean,

    /**
     * Whether to highlight every instance of a participant on hover.
     */
    highlightParticipantOnHover?: boolean,

    /**
     * Whether to show a ranking table on round-robin stages.
     */
    showRankingTable?: boolean,
}

/**
 * The possible types of connection between matches.
 */
export type ConnectionType = 'square' | 'straight' | false;

/**
 * A function returning an origin hint based on a participant's position.
 */
export type OriginHint = (position: number) => string;

/**
 * Info associated to a round in order to name its header.
 */
export type RoundNameInfo = {
    groupType: Exclude<ToI18nKey<GroupType>, 'final-group'>,
    roundNumber: number,
    roundCount: number,
    /**
     * `1` = final, `1/2` = semi finals, `1/4` = quarter finals, etc.
     */
    fractionOfFinal: number,
} | {
    groupType: 'round-robin',
    roundNumber: number,
    roundCount: number,
} | {
    groupType: 'final-group',
    finalType: ToI18nKey<FinalType>,
    roundNumber: number,
    roundCount: number,
}

/**
 * A function returning a round name based on its number and the count of rounds.
 */
export type RoundNameGetter = (info: RoundNameInfo, t: Translator) => string;

/**
 * A function called when a match is clicked.
 */
export type MatchClickCallback = (match: Match) => void;

/**
 * Contains the information about the connections of a match.
 */
export interface Connection {
    connectPrevious?: ConnectionType,
    connectNext?: ConnectionType,
}

/**
 * An item of the ranking.
 */
export interface RankingItem {
    rank: number,
    id: number,
    played: number,
    wins: number,
    draws: number,
    losses: number,
    forfeits: number,
    scoreFor: number,
    scoreAgainst: number,
    scoreDifference: number,
    points: number,
}

/**
 * Contains information about a header of the ranking and its tooltip.
 */
export interface RankingHeader {
    text: string,
    tooltip: string,
}

/**
 * A formula which computes points given a ranking row.
 */
export type RankingFormula = (ranking: RankingItem) => number;

/**
 * An object mapping ranking properties to their header.
 */
export type RankingHeaders = Record<keyof RankingItem, RankingHeader>;

/**
 * An object mapping a participant id to its row in the ranking.
 */
export type RankingMap = Record<number, RankingItem>;

/**
 * Definition of a ranking.
 */
export type Ranking = RankingItem[];

/**
 * Structure containing all the containers for a participant.
 */
export interface ParticipantContainers {
    participant: HTMLElement,
    name: HTMLElement,
    result: HTMLElement,
}

/**
 * Image associated to a participant.
 */
export interface ParticipantImage {
    participantId: number,
    imageUrl: string,
}
