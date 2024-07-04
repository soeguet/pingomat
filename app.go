package main

import (
	"context"
	"fmt"
	"os/exec"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var internalIP string = "192.168.178.1"

func (a *App) SetInternalIP(newIP string) {
	internalIP = newIP
}

func (a *App) GetInternalIP() string {
	return internalIP
}

// App struct
type App struct {
	ctx context.Context
}

// PingResult struct
type PingResult struct {
	Time       string `json:"time"`
	InternalIP string `json:"internalIP"`
	Output     string `json:"output"`
	Success    bool   `json:"success"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) getTimeHHMMSS() string {
	now := time.Now()
	return fmt.Sprintf("%02d:%02d:%02d", now.Hour(), now.Minute(), now.Second())
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// call the ping function to get the internal IP at startup
	go a.startPinging(ctx)
}

func (a *App) startPinging(ctx context.Context) {
	defer func() {
		runtime.EventsEmit(ctx, "pingResult", PingResult{
			Time:       a.getTimeHHMMSS(),
			InternalIP: internalIP,
			Success:    false,
			Output:     "Ping routine stopped",
		})
		fmt.Println("Stopping pinging routine")
	}()

	// Initial delay of 3 seconds
	time.Sleep(3 * time.Second)

	// Initial request
	pingResult := a.ping(internalIP)
	runtime.EventsEmit(ctx, "pingResult", pingResult)

	// Repeated requests
	for {
		select {
		case <-ctx.Done():
			// ext is done, exit the goroutine
			return
		case <-time.After(30 * time.Second):
			pingResult := a.ping(internalIP)
			runtime.EventsEmit(ctx, "pingResult", pingResult)
		}
	}
}

// ping executes the ping command and returns the output
func (a *App) ping(ip string) PingResult {
	out, err := exec.Command("ping", "-c", "1", ip).Output()
	if err != nil {
		return PingResult{
			Time:       a.getTimeHHMMSS(),
			InternalIP: internalIP,
			Success:    false,
			Output:     fmt.Sprintf("Error: %s", err),
		}
	}
	return PingResult{
		Time:       a.getTimeHHMMSS(),
		InternalIP: internalIP,
		Success:    true,
		Output:     string(out),
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
