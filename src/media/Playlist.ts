abstract class Playlist {
    protected id: string;

    protected constructor (id: string) {
        this.id = id;
    }

    public abstract load (): Promise<void>;
    public abstract download (): Promise<void>;
}

export default Playlist;
