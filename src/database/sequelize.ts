import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    Model,
    Sequelize
} from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tracker.sqlite',
    logging: false
});

type PlaylistAttributes = {
    playlist: string;
    source: "spotify" | "deezer";
}

type TrackAttributes = {
    track: string;
    source: "spotify" | "deezer";
}

type AlbumAttributes = {
    album: string;
    source: "spotify" | "deezer";
}

export class DBPlaylist extends Model<PlaylistAttributes> {
    declare playlist: string;
    declare source: "spotify" | "deezer";

    declare getDBTracks: HasManyGetAssociationsMixin<DBTrack>;
    declare addDBTrack: HasManyAddAssociationMixin<DBTrack, string>;
    declare addDBTracks: HasManyAddAssociationsMixin<DBTrack, string>;
    declare setDBTracks: HasManySetAssociationsMixin<DBTrack, string>;
    declare removeDBTrack: HasManyRemoveAssociationMixin<DBTrack, string>;
    declare removeDBTracks: HasManyRemoveAssociationsMixin<DBTrack, string>;
    declare hasDBTrack: HasManyHasAssociationMixin<DBTrack, string>;
    declare hasDBTracks: HasManyHasAssociationsMixin<DBTrack, string>;
    declare countDBTracks: HasManyCountAssociationsMixin;
    declare createDBTrack: HasManyCreateAssociationMixin<DBTrack, 'track'>;
}

export class DBTrack extends Model<TrackAttributes> {
    declare track: string;
    declare source: "spotify" | "deezer";

    declare getDBPlaylists: HasManyGetAssociationsMixin<DBPlaylist>;
    declare addDBPlaylist: HasManyAddAssociationMixin<DBPlaylist, string>;
    declare addDBPlaylists: HasManyAddAssociationsMixin<DBPlaylist, string>;
    declare setDBPlaylists: HasManySetAssociationsMixin<DBPlaylist, string>;
    declare removeDBPlaylist: HasManyRemoveAssociationMixin<DBPlaylist, string>;
    declare removeDBPlaylists: HasManyRemoveAssociationsMixin<DBPlaylist, string>;
    declare hasDBPlaylist: HasManyHasAssociationMixin<DBPlaylist, string>;
    declare hasDBPlaylists: HasManyHasAssociationsMixin<DBPlaylist, string>;
    declare countDBPlaylists: HasManyCountAssociationsMixin;
    declare createDBPlaylist: HasManyCreateAssociationMixin<DBPlaylist, 'playlist'>;

    declare getDBAlbums: HasManyGetAssociationsMixin<DBTrack>;
    declare addDBAlbum: HasManyAddAssociationMixin<DBAlbum, string>;
    declare addDBAlbums: HasManyAddAssociationsMixin<DBAlbum, string>;
    declare setDBAlbums: HasManySetAssociationsMixin<DBAlbum, string>;
    declare removeDBAlbum: HasManyRemoveAssociationMixin<DBAlbum, string>;
    declare removeDBAlbums: HasManyRemoveAssociationsMixin<DBAlbum, string>;
    declare hasDBAlbum: HasManyHasAssociationMixin<DBAlbum, string>;
    declare hasDBAlbums: HasManyHasAssociationsMixin<DBAlbum, string>;
    declare countDBAlbums: HasManyCountAssociationsMixin;
    declare createDBAlbum: HasManyCreateAssociationMixin<DBAlbum, 'album'>;
}

export class DBAlbum extends Model<AlbumAttributes> {
    declare track: string;
    declare source: "spotify" | "deezer";

    declare getDBTracks: HasManyGetAssociationsMixin<DBTrack>;
    declare addDBTrack: HasManyAddAssociationMixin<DBTrack, string>;
    declare addDBTracks: HasManyAddAssociationsMixin<DBTrack, string>;
    declare setDBTracks: HasManySetAssociationsMixin<DBTrack, string>;
    declare removeDBTrack: HasManyRemoveAssociationMixin<DBTrack, string>;
    declare removeDBTracks: HasManyRemoveAssociationsMixin<DBTrack, string>;
    declare hasDBTrack: HasManyHasAssociationMixin<DBTrack, string>;
    declare hasDBTracks: HasManyHasAssociationsMixin<DBTrack, string>;
    declare countDBTracks: HasManyCountAssociationsMixin;
    declare createDBTrack: HasManyCreateAssociationMixin<DBTrack, 'track'>;
}

type AuthDataAttributes = {
    type: 'spotify' | 'deezer';
    access_token: string;
    refresh_token: string;
}

export class AuthData extends Model<AuthDataAttributes> {
    declare type: 'spotify' | 'deezer';
    declare access_token: string;
    declare refresh_token: string;
}

AuthData.init({
    type:{
        type: DataTypes.ENUM('spotify', 'deezer'),
        primaryKey: true
    },
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
}, {sequelize, tableName: 'AuthData' });

DBPlaylist.init({
    playlist: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    source: {
        type: DataTypes.ENUM('spotify', 'deezer')
    }
}, {sequelize, tableName: 'Playlists'});

DBTrack.init({
    track: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    source: {
        type: DataTypes.ENUM('spotify', 'deezer')
    }
}, {sequelize, tableName: 'Tracks'});

DBAlbum.init({
    album: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    source: {
        type: DataTypes.ENUM('spotify', 'deezer')
    }
}, {sequelize, tableName: 'Albums'});

DBTrack.belongsToMany(DBPlaylist, {
    through: 'PlaylistTracks'
});

DBPlaylist.belongsToMany(DBTrack, {
    through: 'PlaylistTracks'
});

DBTrack.belongsToMany(DBAlbum, {
    through: 'AlbumTracks'
});

DBAlbum.belongsToMany(DBTrack, {
    through: 'AlbumTracks'
});

await sequelize.sync();

export default sequelize;
