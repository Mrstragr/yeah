import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface JackpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  winAmount?: string;
}

export function JackpotModal({ isOpen, onClose, winAmount = "125,000" }: JackpotModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gaming-gold to-gaming-amber text-black max-w-md">
        <DialogHeader className="text-center">
          <div className="bg-black/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-trophy text-black text-3xl"></i>
          </div>
          <DialogTitle className="font-orbitron font-black text-3xl text-black">
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-black/80 text-lg">
            Get 【Super Jackpot】!
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <p className="font-orbitron font-bold text-2xl text-black">
              ${winAmount}
            </p>
          </div>
          <p className="text-black/80 mb-6">
            Visit the [Super Jackpot] page to claim your reward
          </p>
        </div>

        <DialogFooter className="justify-center">
          <Button 
            className="bg-black hover:bg-gray-800 text-gaming-gold font-bold py-3 px-8"
            onClick={onClose}
          >
            Claim Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
